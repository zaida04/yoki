import { Command } from "discord-akairo";
import { Message } from "discord.js";

const ignoredCategories = ["owner", "default"];

export default class GenerateReadme extends Command {
    public constructor() {
        super("generate-readme", {
            aliases: ["generate-readme", "gr"],
            description: {
                content: "Generate command info for readme",
                usage: "",
                examples: ["generate-readme"],
            },
            ownerOnly: true,
        });
    }

    public exec(message: Message) {
        const categories = this.client.commandHandler.categories.filter((x) => !ignoredCategories.includes(x.id));
    }
}
