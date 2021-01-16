import { Message } from "discord.js";
import { Listener } from "discord-akairo";

export default class LevelingMessageInvalid extends Listener {
    public constructor() {
        super("leveling-messageInvalid", {
            emitter: "commandHandler",
            event: "messageInvalid",
        });
    }

    public async exec(message: Message) {
        if (!message.guild) return;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (message.partial) return;
        return this.client.leveling.onMessage(message);
    }
}
