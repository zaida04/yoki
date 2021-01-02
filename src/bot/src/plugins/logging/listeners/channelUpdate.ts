import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { DMChannel } from "discord.js";
import { GuildChannel } from "discord.js";
import { handleMissingSend } from "../../../common/PermissionUtil";
import { YokiColors } from "../../../common/YokiColors";

export default class channelUpdate extends Listener {
    public constructor() {
        super("logging-channelUpdate", {
            emitter: "client",
            event: "channelUpdate",
        });
    }

    public async exec(oldChannel: GuildChannel | DMChannel, newChannel: GuildChannel | DMChannel) {
        if (oldChannel instanceof DMChannel || newChannel instanceof DMChannel) return;
        const logChannel = await oldChannel.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;
        const changes = [];

        if (oldChannel.name !== newChannel.name)
            changes.push(`**Channel Name:** \`${oldChannel.name}\` => \`${newChannel.name}\``);

        if (oldChannel.parentID !== newChannel.parentID)
            changes.push(
                `**Channel Parent:** \`${oldChannel.parent?.name ?? "None"}\` => \`${
                    newChannel.parent?.name ?? "None"
                }\``,
            );

        if (!changes.length) return;
        const embed = new MessageEmbed()
            .setColor(YokiColors.LIGHT_ORANGE)
            .setTitle("Channel Updated")
            .setDescription(changes.join("\n"))
            .setTimestamp();
        logChannel.send(embed).catch((e) => handleMissingSend(e, logChannel, oldChannel.guild));
    }
}
