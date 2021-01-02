import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class Help extends Command {
    public constructor() {
        super("invite", {
            aliases: ["invite"],
            description: {
                content: "Get an invite link for me!",
            },
        });
    }

    public async exec(message: Message) {
        return message.channel.send(
            `You can invite me at this link: https://discord.com/oauth2/authorize?client_id=${
                this.client.user!.id
            }&scope=bot&permissions=2111171830`,
        );
    }
}
