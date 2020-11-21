import { Message } from "discord.js";
import { Listener } from "discord-akairo";

export default class CommandBlockedListener extends Listener {
    public constructor() {
        super("tags-messageInvalid", {
            emitter: "commandHandler",
            event: "messageInvalid",
            category: "commandHandler",
        });
    }

    public async exec(message: Message) {
        if (!message.guild) return;
        const prefix = await message.guild.settings.get<string>("prefix") ?? this.client.config.defaultPrefix
        return message.content.startsWith(prefix) ? this.runTag(message, prefix) : null;
    }

    private async runTag(message: Message, prefix: string) {
        const tag_show = this.client.commandHandler.modules.get("tag-show");
        return tag_show
            ? this.client.commandHandler.runCommand(message, tag_show, {
                  name: message.content.slice(prefix.length),
              })
            : null;
    }
}
