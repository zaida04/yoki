import { Message } from "discord.js";
import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";

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

        const sanitizedContent = message.content.replace(/[\u200B-\u200D\uFEFF]/g, "").toLowerCase();
        const words = await this.client.messageFilter.get(message.guild.id);
        if (Array.from(words).some((x) => sanitizedContent.includes(x))) {
            this.client.Logger.log(
                `${message.author.tag} (${message.author.id}) has tripped the message filter in ${message.guild.id}`
            );
            return message.delete().then(async (_) => {
                void message.reply("You have said a banned word in this server!");
                const createdCase = await this.client.caseActions.create({
                    executor: this.client.user!,
                    reason: `\`Triggered the message filter\``,
                    type: "warn",
                    message: null,
                    target: message.author,
                    guild: message.guild!,
                });
                const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");
                if (logChannel) {
                    const logMessage = await logChannel.send(new this.client.moderation.ActionEmbed(createdCase));
                    void this.client.caseActions.updateMessage(createdCase, logMessage);
                    this.client.caseActions.cache.delete(createdCase.id);
                }
            });
        }
        return null;
    }
}
