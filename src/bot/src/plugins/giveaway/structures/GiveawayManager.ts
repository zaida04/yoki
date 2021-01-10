import { stripIndents } from "common-tags";
import { AkairoClient } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Guild, User } from "discord.js";
import { GuildEmoji } from "discord.js";
import { TextChannel } from "discord.js";
import { GiveawayDatabaseData } from "../typings/Giveaway";
import GiveawayScheduler from "./GiveawayScheduler";

export default class GiveawayManager {
    public scheduler: GiveawayScheduler = new GiveawayScheduler(this.client);

    public constructor(public client: AkairoClient) {}

    public async end(guild_id: string, id: string) {
        const giveaway = await this.fetch(guild_id, id);
        if (!giveaway) throw new Error();

        await this.scheduler.sweep(giveaway);
        await this.client.db
            .api("giveaways")
            .where({
                guild_id,
                id,
            })
            .del();
        return giveaway;
    }

    public async delete(guild_id: string, id: string) {
        const giveaway = await this.client.db
            .api<GiveawayDatabaseData>("giveaways")
            .where({
                guild_id,
                id,
            })
            .first();
        if (!giveaway) return null;
        const channel = await this.client.channels.fetch(giveaway.channel_id).catch(() => null);
        if (!channel) return null;
        const message = await (channel as TextChannel).messages.fetch(giveaway.message_id).catch(() => null);
        void message?.delete();

        this.client.giveaways.scheduler.timeouts.delete(id);
        return this.client.db
            .api("giveaways")
            .where({
                guild_id,
                id,
            })
            .del();
    }

    public async create({
        guild,
        channel,
        title,
        description,
        emoji,
        creator,
        winner_count,
        expiration_date,
    }: {
        guild: Guild;
        channel: TextChannel;
        title: string;
        description: string;
        emoji: GuildEmoji;
        creator: User;
        winner_count: number;
        expiration_date: Date;
    }) {
        const created = await this.client.db.api("giveaways").insert(
            {
                guild_id: guild.id,
                title: title,
                description: description,
                emoji: emoji.id,
                creator: creator.id,
                ended: false,
                winner_count: winner_count,
                expiration_date: expiration_date,
            },
            ["id"],
        );

        const sent_giveaway = await channel.send(
            new MessageEmbed()
                .setColor("PURPLE")
                .setTitle(title.toLowerCase() === "none" ? "New Giveaway! 🎉" : title)
                .setDescription(
                    stripIndents`
                                ${description}

                                React with ${emoji} to enroll!
                                Number of winners: \`${winner_count}\`
                                Expires on: \`${expiration_date.toISOString()}\`
                                Creator: ${creator}
                                `,
                )
                .setFooter(`ID: ${created[0]} • Ends at`)
                .setTimestamp(expiration_date),
        );

        void sent_giveaway.react(emoji);
        void this.client.db
            .api("giveaways")
            .where("id", created[0])
            .update({
                message_id: sent_giveaway.id,
                channel_id: channel.id,
            })
            .then((x) => x);

        return { giveaway_id: created[0], ...sent_giveaway };
    }

    public fetch(guild_id: string, id: string) {
        return this.client.db
            .api<GiveawayDatabaseData>("giveaways")
            .where({
                guild_id,
                id,
            })
            .first()
            .then((x) => x ?? null);
    }
}
