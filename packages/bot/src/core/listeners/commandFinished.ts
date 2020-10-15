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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public exec(message: Message, command: Command, args: any) {
        this.client.Logger.log(
            `Finished ${command.id} on ${
                message.guild
                    ? `${message.guild.name} (${message.guild.id})`
                    : `DM (${message.author.tag} - ${message.author.id})`
            }${Object.keys(args).length && !args.command ? ` with arguments ${JSON.stringify(args)}` : ""}`
        );
    }
}
