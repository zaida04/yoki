import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class suggestionCreate extends Command {
    public constructor() {
        super("suggestion-accept", {
            category: "suggestion",
            module: "suggestion",
            description: {
                content: "Create a suggestion",
                usage: "<id>",
                example: ["suggestion create"],
            },
            args: [{}],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "dm",
        });
    }

    public async exec(message: Message) {}
}
