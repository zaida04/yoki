import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Role } from "discord.js";
import { TextChannel } from "discord.js";
import { handleMissingSend } from "../../common/PermissionUtil";
import { YokiColors } from "../../common/YokiColors";

export default class roleDelete extends Listener {
    public constructor() {
        super("logging-roleDelete", {
            emitter: "client",
            event: "roleDelete",
        });
    }

    public async exec(role: Role) {
        const logChannel = await role.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor(YokiColors.LIGHT_ORANGE)
            .setTitle("Role Deleted")
            .setDescription(`${role.name} \`(${role.id})\``)
            .setTimestamp();
        logChannel.send(embed).catch((e) => handleMissingSend(e, logChannel, role.guild));
    }
}
