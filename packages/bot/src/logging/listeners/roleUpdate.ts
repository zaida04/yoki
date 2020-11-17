import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Role } from "discord.js";
import { TextChannel } from "discord.js";

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
            .setColor("GOLD")
            .setTitle("Role Updated")
            .setDescription(changes.join("\n"))
            .setTimestamp();
        void logChannel.send(embed);
    }
}
