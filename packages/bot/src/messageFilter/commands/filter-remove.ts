import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class filterRemove extends Command {
    public constructor() {
        super("filter-remove", {
            category: "messageFilter",
            module: "messageFilter",
            description: {
                content: "remove a word from the message filter",
                usage: "<word>",
                example: ["filter remove word1"],
            },
            args: [
                {
                    id: "word",
                    type: "lowercase",
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { word }: { word?: string }) {
        if (!(await message.guild?.settings.get("messageFilterEnabled")))
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Message filter is not enabled!",
                    "You can enable it by doing the `settings message-filter enable` command"
                )
            );
        if (!word) return message.channel.send(new this.client.Embeds.ErrorEmbed("Must proivde a word!"));

        await this.client.messageFilter.delete({
            guild_id: message.guild!.id,
            content: word,
        });
        return message.channel.send(`If the word is in the filter, it will be deleted!`);
    }
}
