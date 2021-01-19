import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Role, TextChannel } from "discord.js";
import { handleMissingSend } from "../../../common/PermissionUtil";
import { GamerNestColors } from "../../../common/GamerNestColors";

export default class roleUpdate extends Listener {
    public constructor() {
        super("logging-roleUpdate", {
            emitter: "client",
            event: "roleUpdate",
        });
    }

    public async exec(oldRole: Role, newRole: Role) {
        const logChannel = await oldRole.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;
        const changes = [];

        if (oldRole.name !== newRole.name) changes.push(`**Name:** \`${oldRole.name}\` => \`${newRole.name}\``);
        if (oldRole.color !== newRole.color) changes.push(`**Cplor:** \`${oldRole.color}\` => \`${newRole.color}\``);

        if (!changes.length) return;
        const embed = new MessageEmbed()
            .setColor(GamerNestColors.LIGHT_ORANGE)
            .setTitle("Role Updated")
            .setDescription(changes.join("\n"))
            .setTimestamp();
        logChannel.send(embed).catch((e) => handleMissingSend(e, logChannel, oldRole.guild));
    }
}
