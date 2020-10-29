import { MessageEmbed } from "discord.js";
import SubCommand from "../../../common/SubCommand";

export default class SubCommandEmbed extends MessageEmbed {
    public constructor(command: SubCommand) {
        super();
        super.setDescription(
            `Options for this command are: ${command.subCommands
                .map((x: string[]) => `\`${x[1]}\``)
                .join(", ")}.\n Example: \`${command.aliases[0]} ${command.subCommands[0][1]} [...args]\``
        );
        super.setColor("GOLD");
    }
}
