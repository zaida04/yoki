import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class CommandFinishedListener extends Listener {
    public constructor() {
        super("commandFinished", {
            emitter: "commandHandler",
            event: "commandFinished",
            category: "commandHandler",
        });
    }

    public exec(message: Message, command: Command, args: unknown[]) {
        this.client.Logger.log(
            `Finished ${command.id} on ${message.guild ? `${message.guild.name} (${message.guild.id})` : "DM"}${
                Object.keys(args).length ? ` with arguments ${JSON.stringify(args)}` : ""
            }`
        );
    }
}
