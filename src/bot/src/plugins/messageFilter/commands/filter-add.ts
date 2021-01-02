import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class filterAdd extends Command {
    public constructor() {
        super("filter-add", {
            category: "message-filter",
            module: "messageFilter",
            description: {
                content: "Add a word to the message filter",
                usage: "<word>",
                example: ["filter add word1"],
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
                    "You can enable it by doing the `settings message-filter enable` command",
                ),
            );
        if (!word) return message.channel.send(new this.client.Embeds.ErrorEmbed("Must provide a word!"));
        if (await (await this.client.messageFilter.get(message.guild!.id)).has(word))
            return message.channel.send(new this.client.Embeds.ErrorEmbed("That word is already in the filter!"));

        await this.client.messageFilter.add({
            guild_id: message.guild!.id,
            content: word,
            creator_id: message.author.id,
        });
        return message.channel.send(`Word has successfully been added to the message filter!`);
    }
}
