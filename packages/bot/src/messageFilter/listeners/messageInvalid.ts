import { Message } from "discord.js";
import { Listener } from "discord-akairo";

export default class CommandBlockedListener extends Listener {
    public constructor() {
        super("messageFilter-messageInvalid", {
            emitter: "commandHandler",
            event: "messageInvalid",
            category: "commandHandler",
        });
    }

    public async exec(message: Message) {
        if (!message.guild) return;
        if (message.guild.messageFilter === undefined) {
            message.guild.messageFilter = (await message.guild.settings.get<boolean>("messageFilterEnabled")) ?? false;
        }
        if (!message.guild.messageFilter) return;

        const sanitizedContent = message.content.replace(/[\u200B-\u200D\uFEFF]/g, "");
        const words = await this.client.messageFilter.get(message.guild.id);
        if (words.has(sanitizedContent)) {
            return message.delete().then((_) => message.reply("You have said a banned word in this server!"));
        }
        return null;
    }
}
