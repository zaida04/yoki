import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class Support extends Command {
    public constructor() {
        super("support", {
            aliases: ["support"],
            description: {
                content: "Get an invite link for our support server!",
            },
        });
    }

    public async exec(message: Message) {
        return message.channel.send(`You can join our support server using this link: https://discord.gg/jf66UUN`);
    }
}
