import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Role } from "discord.js";
import { TextChannel } from "discord.js";

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
            .setColor("RED")
            .setTitle("Role Deleted")
            .setDescription(`${role.name} \`(${role.id})\``)
            .setTimestamp();
        void logChannel.send(embed);
    }
}
