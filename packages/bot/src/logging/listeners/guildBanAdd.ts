import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Guild } from "discord.js";
import { User } from "discord.js";
import Action from "../../moderation/structures/Action";

import { retrieveLogChannel } from "../../common/retrieveChannel";

export default class guildBanAdd extends Listener {
    public constructor() {
        super("logging-guildBanAdd", {
            emitter: "client",
            event: "guildBanAdd",
        });
    }

    public async exec(guild: Guild, user: User) {
        if (
            this.client.caseActions.cache.some(
                (x: Action) => x.user.id === user.id && (x.type === "ban" || x.type === "softban")
            )
        )
            return;

        const logChannel = await retrieveLogChannel(guild);
        if (!logChannel) return;

        return logChannel.send(
            new MessageEmbed()
                .setAuthor("Unknown Executor")
                .setDescription(
                    `
                **Target:** \`${user.tag}\` (${user.id})
                **Type:** \`ban\`
                `
                )
                .setTimestamp()
        );
    }
}
