import { stripIndents } from "common-tags";
import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { DMChannel } from "discord.js";
import { GuildChannel } from "discord.js";
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
        if (channel instanceof DMChannel) return;
        if (this.client.tickets.cache.some((x) => x.channel!.id === channel.id)) return;
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
