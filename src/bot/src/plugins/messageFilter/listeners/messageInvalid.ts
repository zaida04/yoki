import { Message } from "discord.js";
import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";

const discordRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gi;

export default class messageFilterMessageInvalid extends Listener {
    public constructor() {
        super("messageFilter-messageInvalid", {
            emitter: "commandHandler",
            event: "messageInvalid",
            category: "commandHandler",
        });
    }

    public async exec(message: Message) {
        if (!message.guild) return;
        if (message.member?.hasPermission("MANAGE_GUILD")) return;
        if (message.guild.messageFilter === undefined) {
            message.guild.messageFilter = (await message.guild.settings.get<boolean>("messageFilterEnabled")) ?? false;
        }
        if (!message.guild.messageFilter) return;

        const sanitizedContent = message.content.replace(/[\u200B-\u200D\uFEFF]/g, "").toLowerCase();
        const words = await this.client.messageFilter.get(message.guild.id);

        if (await message.guild.settings.get("autoModEnabled"))
            if (discordRegex.test(sanitizedContent)) {
                if (message.deletable) void message.delete();
                const createdCase = await this.client.caseActions.create({
                    executor: this.client.user!,
                    reason: `\`Links to other Discord Servers\``,
                    type: "warn",
                    message: null,
                    expiration_date: null,
                    target: message.author,
                    guild: message.guild,
                });
                const logChannel = await message.guild.settings.channel<TextChannel>("modLogChannel", "text");
                if (logChannel) {
                    const logMessage = await logChannel.send(new this.client.moderation.ActionEmbed(createdCase));
                    void this.client.caseActions.updateMessage(createdCase, logMessage);
                    this.client.caseActions.cache.delete(createdCase.id);
                    void message.author
                        .send(
                            `You have been \`warned\` in **${message.guild.name}**\n\nReason: \`You have sent a link to another discord server which is forbidden.\`\nPlease make sure this doesn't happen again, otherwise you are subject to the servers punishment`
                        )
                        .catch((e) => e);
                }
                return message.channel.send("Links to other discord servers are not allowed!");
            }

        if (Array.from(words).some((x) => sanitizedContent.includes(x))) {
            this.client.Logger.log(
                `${message.author.tag} (${message.author.id}) has tripped the message filter in ${message.guild.id}`
            );
            return message.deletable
                ? message.delete().then(async (_) => {
                      void message.reply("You have said a banned word in this server!");
                      const createdCase = await this.client.caseActions.create({
                          executor: this.client.user!,
                          reason: `\`Triggered the message filter\``,
                          type: "warn",
                          message: null,
                          expiration_date: null,
                          target: message.author,
                          guild: message.guild!,
                      });
                      const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");
                      if (logChannel) {
                          const logMessage = await logChannel.send(new this.client.moderation.ActionEmbed(createdCase));
                          void this.client.caseActions.updateMessage(createdCase, logMessage);
                          this.client.caseActions.cache.delete(createdCase.id);
                          void message.author.send(
                              `You have been \`warned\` in **${
                                  message.guild!.name
                              }**\nReason: \`You have said a forbidden word in this server.\`\n\nPlease make sure this doesn't happen again, otherwise you are subject to the servers punishment\n`
                          );
                      }
                  })
                : void 0;
        }
        return null;
    }
}
