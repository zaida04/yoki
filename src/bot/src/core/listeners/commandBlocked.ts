import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class CommandBlockedListener extends Listener {
    public constructor() {
        super("commandBlocked", {
            emitter: "commandHandler",
            event: "commandBlocked",
            category: "commandHandler",
        });
    }

    public exec(message: Message, command: Command, reason: string) {
        this.client.Logger.warn(
            `Blocked ${command.id} on ${message.guild ? `${message.guild.name} (${message.guild.id})` : "DM"} from ${
                message.author.id
            } with reason ${reason}`,
        );
        let output = "";
        switch (reason) {
            case "dm": {
                output = "You must execute this command in my DMs!";
                break;
            }
            case "guild": {
                output = "You can only do this command in a server!";
                break;
            }
            default: {
                output = reason;
            }
        }
        return message.channel.send(`You cannot do this command! ${output}`);
    }
}
