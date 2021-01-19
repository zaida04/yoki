import { stripIndents } from "common-tags";
import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { TextChannel, User, Guild } from "discord.js";
import type Action from "../../moderation/structures/Action";

export default class guildBanAdd extends Listener {
    public constructor() {
        super("logging-guildBanAdd", {
            emitter: "client",
            event: "guildBanAdd",
        });
    }

    public async exec(guild: Guild, user: User) {
        if (
            this.client.moderation.caseActions.cache.some(
                (x: Action) => x.target.id === user.id && (x.type === "ban" || x.type === "softban"),
            )
        )
            return;

        const logChannel = await guild.settings.channel<TextChannel>("modLogChannel", "text");
        if (!logChannel) return;

        return logChannel.send(
            new MessageEmbed()
                .setAuthor("Unknown Executor")
                .setDescription(
                    stripIndents`
                    **Target:** ${user} \`(${user.id})\`
                    **Type:** \`ban\`
                    `,
                )
                .setTimestamp(),
        );
    }
}
