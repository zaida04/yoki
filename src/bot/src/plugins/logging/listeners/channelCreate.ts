import { stripIndents } from "common-tags";
import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { TextChannel, GuildChannel, DMChannel } from "discord.js";
import { handleMissingSend } from "../../../common/PermissionUtil";
import { YokiColors } from "../../../common/YokiColors";

export default class channelCreate extends Listener {
    public constructor() {
        super("logging-channelCreate", {
            emitter: "client",
            event: "channelCreate",
        });
    }

    public async exec(channel: GuildChannel | DMChannel) {
        if (channel.type === "dm") return;
        if (this.client.tickets.cache.some((x) => x.channel!.id === channel.id)) return;
        if (this.client.inhibitedChannels.has(channel.id)) return this.client.inhibitedChannels.delete(channel.id);
        const logChannel = await channel.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor(YokiColors.GREEN)
            .setTitle("Channel Created")
            .setDescription(
                stripIndents`
            Name: \`${channel.name}\` 
            ID: \`(${channel.id})\`
            `,
            )
            .setTimestamp();
        logChannel.send(embed).catch((e) => handleMissingSend(e, logChannel, channel.guild));
    }
}
