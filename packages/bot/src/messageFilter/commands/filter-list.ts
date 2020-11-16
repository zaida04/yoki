import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { DatabaseBannedWordEntry } from "../typings/word";

export default class filterList extends Command {
    public constructor() {
        super("filter-list", {
            category: "messageFilter",
            module: "messageFilter",
            description: {
                content: "See the banned words of this guild",
                usage: "",
                example: ["filter list"],
            },
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(message: Message) {
        if (!(await message.guild?.settings.get("messageFilterEnabled")))
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Message filter is not enabled!",
                    "You can enable it by doing the `settings message-filter enable` command"
                )
            );

        const guild_filter_words: DatabaseBannedWordEntry[] = await this.client.db
            .api<DatabaseBannedWordEntry>("messageFilter")
            .where("guild_id", message.guild!.id);

        return message.channel.send(
            guild_filter_words.length > 0
                ? `The banned words for this server are: ${guild_filter_words
                      .map((x) => `||${x.content}||`)
                      .join(", ")}`
                : "This server does not have any banned words.\nYou can add one using the `filter add <word>` command"
        );
    }
}
