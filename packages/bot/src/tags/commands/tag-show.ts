import { Command } from "discord-akairo";
import { Util } from "discord.js";

import { Message } from "discord.js";
import { DatabaseTagEntry } from "../typings/tag";

export default class tagInfo extends Command {
    public constructor() {
        super("tag-show", {
            category: "tags",
            module: "tags",
            description: {
                content: "Show a tag by name",
                usage: "<id>",
                example: ["tags show 345", "tag show test1"],
            },
            args: [
                {
                    id: "name",
                    match: "content",
                    type: "lowercase",
                },
            ],
            channel: "guild",
            clientPermissions: ["EMBED_LINKS"],
        });
    }

    public async exec(message: Message, { name, tag }: { name?: string; tag?: DatabaseTagEntry }) {
        if (!tag) {
            if (!name) return;
            const tagname = Util.cleanContent(name, message);
            const fetchTag = await this.client.tagHandler.fetch(message.guild!, { name: tagname });
            if (!fetchTag) return;
            return message.channel.send(fetchTag.content);
        }

        return message.channel.send(tag.content);
    }
}
