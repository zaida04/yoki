import { stripIndent } from "common-tags";
import { AkairoClient } from "discord-akairo";
import { User } from "discord.js";
import { TextChannel } from "discord.js";
import Scheduler from "../../../common/Scheduler";
import { GiveawayDatabaseData } from "../typings/Giveaway";

export default class GiveawayScheduler extends Scheduler<GiveawayDatabaseData> {
    public constructor(client: AkairoClient) {
        super(client, 900);
    }

    public async sweep(giveaway: GiveawayDatabaseData) {
        const guild = await this.client.guilds.fetch(giveaway.guild_id).catch(() => null);
        if (!guild) return;
        const channel = guild.channels.cache.get(giveaway.channel_id) as TextChannel | undefined;
        if (!channel) return;
        const message = await channel.messages.fetch(giveaway.message_id).catch(() => null);
        if (!message) return;
        try {
            const reactions = await message.reactions.cache
                .get(giveaway.emoji)
                ?.fetch()
                .catch(() => null);
            if (!reactions)
                throw new Error(
                    `The reaction ${giveaway.emoji} doesn't exist on the giveaway message ${giveaway.message_id}`,
                );
            const user_reactions_clone = (await reactions.users.fetch()).filter((x) => !x.bot).clone();
            if (!user_reactions_clone.size)
                return message.edit("Hmmmm.. no one entered the giveaway and it ended!", {
                    embed: message.embeds[0].setFooter(`ID: ${giveaway.id} • Ended At`),
                });
            if (giveaway.winner_count > user_reactions_clone.size)
                return message.edit("Not enough people entered this giveaway and it ended!", {
                    embed: message.embeds[0].setFooter(`ID: ${giveaway.id} • Ended At`),
                });

            const winners = [];
            for (let i = 1; i <= giveaway.winner_count; i++) {
                const winner: User = user_reactions_clone.random();
                winners.push(winner.id);
                user_reactions_clone.delete(winner.id);
            }
            if (!winners.length)
                return message.edit("There were... no winners...?", {
                    embed: message.embeds[0].setFooter(`ID: ${giveaway.id} • Ended At`),
                });

            await message.edit(
                `**This giveaway has ended! ${
                    winners.length > 1
                        ? `The winners are: ${winners.map((x) => `<@${x}>`).join(", ")}`
                        : `The winner is: <@${winners[0]}>`
                }**`,
                {
                    embed: message.embeds[0].setFooter(`ID: ${giveaway.id} • Ended At`),
                },
            );
        } catch (e) {
            this.client.Logger.error(
                `There was an error sweeping giveaway with the id of ${giveaway.id} in guild ${giveaway.guild_id}. ${e.stack}`,
            );
            return (await this.client.users.fetch(giveaway.creator))
                .send(
                    stripIndent`
                    Your giveaway with the id of \`${giveaway.id}\` that was set to expire on \`${new Date(
                        giveaway.expiration_date,
                    ).toISOString()}\` with the description of \`${giveaway.description}\` failed! \`${e.message}\`. 
                    
                    As a result, I've marked this giveaway to be expired.`,
                )
                .catch();
        } finally {
            await this.client.db.api("giveaways").where("id", giveaway.id).update("ended", true);
        }
    }

    public async sweeper() {
        const potentially_expired_giveaways = await this.client.db
            .api<GiveawayDatabaseData>("giveaways")
            .where("ended", false)
            .where("expiration_date", "<", new Date(Date.now() + this.checkRate * 1000));

        this.client.Logger.log(
            `Sweeping giveaways, ${potentially_expired_giveaways.length} giveaway(s) expired. ${
                potentially_expired_giveaways.length > 0
                    ? `IDS: ${potentially_expired_giveaways.map((x) => x.id).join(", ")}`
                    : ""
            }`,
        );

        for (const giveaway of potentially_expired_giveaways) {
            const timeout = new Date(giveaway.expiration_date).getTime() - Date.now();
            this.timeouts.set(
                giveaway.id,
                this.client.setTimeout(
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    () => this.sweep(giveaway),
                    timeout < 1 ? 10000 : timeout,
                ),
            );
        }
    }
}
