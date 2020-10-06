import { Command } from "discord-akairo";
import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class Premium extends Inhibitor {
    public constructor() {
        super("premium-inhibitor", {
            reason: "You are not a premium user!",
            type: "post",
            priority: 0,
        });
    }

    public async exec(message: Message, command: Command) {
        if (!command.premium) return;
        return (await message.guild?.settings.get<boolean>("premium")) !== command.premium;
    }
}
