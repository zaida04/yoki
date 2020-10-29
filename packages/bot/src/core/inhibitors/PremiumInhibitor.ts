import { Command, Inhibitor } from "discord-akairo";
import { Message } from "discord.js";
import YokiCommand from "../../common/YokiCommand";

export default class Premium extends Inhibitor {
    public constructor() {
        super("premium-inhibitor", {
            reason: "You are not a premium user!",
            type: "post",
            priority: 0,
        });
    }

    public async exec(message: Message, command?: Command): Promise<boolean> {
        if (!command) return false;
        if (!(command as YokiCommand).premium) return false;
        if (!message.guild) return false;
        const premium = await message.guild.settings.get<boolean>("premium");

        return premium !== (command as YokiCommand).premium;
    }
}
