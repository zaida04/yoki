import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Role } from "discord.js";
import { TextChannel } from "discord.js";
import { handleMissingSend } from "../../common/PermissionUtil";
import { YokiColors } from "../../common/YokiColors";

export default class roleCreate extends Listener {
    public constructor() {
        super("logging-roleCreate", {
            emitter: "client",
            event: "roleCreate",
        });
    }

    public async exec(role: Role) {
        const logChannel = await role.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor(YokiColors.LIGHT_ORANGE)
            .setTitle("Role Created")
            .setDescription(`${role} \`(${role.id})\``)
            .setTimestamp();
        logChannel.send(embed).catch((e) => handleMissingSend(e, logChannel, role.guild));
    }
}
