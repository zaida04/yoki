import { Category } from "discord-akairo";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { YokiColors } from "../../../common/YokiColors";
import YokiCommand from "../../../common/YokiCommand";
const ignoredCategories = ["owner", "default"];

export default class Help extends Command {
    public constructor() {
        super("help", {
            aliases: ["help", "h"],
            args: [
                {
                    id: "command",
                    type: "commandAlias",
                    default: null,
                },
            ],
            category: "utilities",
            description: {
                content: "Displays information about a command",
                usage: "[command]",
                example: ["help ban"],
            },
        });
    }

    public async exec(message: Message, { command }: { command?: YokiCommand }) {
        const prefix = (await message.guild?.settings.get<string>("prefix")) ?? this.client.config.defaultPrefix;
        const embed = new MessageEmbed().setColor(YokiColors.LIGHT_ORANGE);

        if (command) {
            embed
                .addField("❯ Description", command.description.content || "No Description provided")
                .addField(
                    "❯ Usage",
                    `\`${prefix}${command.aliases[0]}${
                        command.description.usage ? ` ${command.description.usage}` : ""
                    }\``
                )
                .addField(
                    "❯ Examples",
                    command.description.example.map((x: string[]) => `\`${prefix}${x}\``).join("\n")
                );
            if (command.aliases.length > 1) {
                embed.addField(
                    "❯ Aliases",
                    `\`${command.aliases.filter((x: string) => x !== command.id).join("`, `")}\``
                );
            }
            return message.channel.send(embed);
        }
        embed.setTitle("Commands").setDescription(
            `
					A list of available commands.
                    For additional info on a command, type \`${prefix}help [command]\`
                    
                    **Arguments:**
                    \`<>\` - required.
                    \`[]\` - optional.
                    
					`
        );
        for (const category of this.client.commandHandler.categories
            .filter((x: Category<string, Command>) => !ignoredCategories.includes(x.id))
            .values()) {
            embed.addField(
                `❯ ${category.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`,
                `${category
                    .filter((cmd) => cmd.aliases.length > 0)
                    .map((cmd) => `\`${cmd.aliases[0]}\``)
                    .join(" ")}`
            );
        }

        return message.channel.send(embed);
    }
}
