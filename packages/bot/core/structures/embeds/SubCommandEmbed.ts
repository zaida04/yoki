import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class SubCommandEmbed extends MessageEmbed {
    public constructor(command: Command) {
        super();
        super.setDescription(
            `Options for this command are: ${command
                .sub_commands!.map((x: string) => `\`${x}\``)
                .join(", ")}.\n Example: \`${command.aliases[0]} ${command.sub_commands![0]} [...args]\``
        );
        super.setColor("GOLD");
        super.setFooter(command.client.user!.tag, command.client.user!.displayAvatarURL());
        super.setTimestamp();
    }
}
