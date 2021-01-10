import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class GiveawayEnd extends Command {
    public constructor() {
        super("giveaways-end", {
            category: "giveaways",
            module: "giveaways",
            description: {
                content: "End the giveaway early",
                usage: "",
                example: [],
            },
            args: [
                {
                    id: "id",
                    type: "string",
                    prompt: {
                        start: "What's the ID of the giveaway you want to cancel?",
                    },
                },
            ],
            channel: "guild",
        });
    }

    public async exec(message: Message, { id }: { id: string }) {
        await this.client.giveaways.end(message.guild!.id, id);
        return message.channel.send("Ending that giveaway early. Done.");
    }
}
