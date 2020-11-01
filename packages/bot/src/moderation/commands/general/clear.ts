import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { retrieveModLogChannel } from "../../../common/retrieveChannel";
import { YokiColors } from "../../../common/YokiColors";

export default class Clear extends Command {
    public constructor() {
        super("clear", {
            aliases: ["clear", "purge", "delete"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "Delete a certain amount of messages in this channel",
                usage: "<amount>",
                examples: ["clear 5"],
            },
            args: [
                {
                    id: "amount",
                    type: "integer",
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
            const deleted_messages = await message.channel.bulkDelete(amount + 1);
            const logChannel = await retrieveModLogChannel(message.guild!);

            void logChannel?.send({
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
            });
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
