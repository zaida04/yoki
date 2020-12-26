import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";

export default class CommandErrorListener extends Listener {
    public constructor() {
        super("error", {
            emitter: "commandHandler",
            event: "error",
            category: "commandHandler",
        });
    }

    public exec(error: Error, message: Message) {
        this.client.Logger.error(`[Command Error] ${error.stack ? error.stack : "NO STACK"}`);
        if (!(message.channel instanceof TextChannel)) return;
        if (!message.channel.permissionsFor(this.client.user!)!.has("SEND_MESSAGES")) return;
        return message.channel.send(
            new this.client.Embeds.ErrorEmbed(
                "An Internal Error occured.",
                "Please join our support server by doing the `support` command and report this problem to us if it continues."
            )
        );
    }
}
