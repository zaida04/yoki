import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { handleMissingSend } from "../../../../common/PermissionUtil";

import { YokiColors } from "../../../../common/YokiColors";

export default class Clear extends Command {
    public constructor() {
        super("clear", {
            aliases: ["clear", "purge", "delete"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "Delete a certain amount of messages in this channel",
                usage: "<amount>",
                example: ["clear 5"],
            },
            args: [
                {
                    id: "amount",
                    type: "integer",
                    prompt: {
                        optional: true,
                        start: "Please provide an amount of messages to delete *(say it below)*",
                    },
                },
            ],
            clientPermissions: ["MANAGE_MESSAGES"],
            userPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { amount }: { amount: number }) {
        if (!amount || amount < 1)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(this.client.Responses.INVALID_MESSAGE_AMOUNT, null)
            );
        if (!(message.channel instanceof TextChannel)) return;
        if (amount > 1) {
            try {
                const deleted_messages = await message.channel.bulkDelete(amount + 1);
                const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");

                logChannel
                    ?.send({
                        embed: new MessageEmbed()
                            .setTitle("Purged Messages")
                            .setDescription(
                                `
                        **Amount:** ${deleted_messages.size} 
                        **In:** ${message.channel}
                        `
                            )
                            .setColor(YokiColors.LIGHT_ORANGE),
                        files: [
                            {
                                attachment: Buffer.from(
                                    deleted_messages
                                        .map(
                                            (x) =>
                                                `AUTHOR: ${x.author.tag} (${x.author.id}); CONTENT: ${x.content.replace(
                                                    /\n/g,
                                                    " "
                                                )}; EMBEDS: ${x.embeds.length > 0 ? "YES" : "NO"}`
                                        )
                                        .join("\n")
                                ),
                                name: `PURGE-${new Date().toISOString().slice(0, 10)}.txt`,
                            },
                        ],
                    })
                    .catch((e) => handleMissingSend(e, logChannel, message.guild!));
            } catch (e) {
                return message.channel
                    .send("Some or all of these messages are older than 14 days and cannot be deleted.")
                    .then((x) => x.delete({ timeout: 5000 }));
            }
        } else {
            const lastMessage = await message.channel.messages.fetch({
                limit: 2,
            });
            void lastMessage.first(2)[1].delete();
            void message.delete();
        }
        return message.channel
            .send(new this.client.Embeds.SuccessEmbed(null, this.client.Responses.PURGE_RESPONSE(amount, 5), message))
            .then((x) =>
                x.delete({
                    timeout: 5000,
                })
            );
    }
}
