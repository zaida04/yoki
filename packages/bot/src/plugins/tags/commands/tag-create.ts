import { Command } from "discord-akairo";
import { Util } from "discord.js";

import { Message } from "discord.js";

export default class tagCreate extends Command {
    public constructor() {
        super("tag-create", {
            category: "tags",
            module: "tags",
            description: {
                content: "Create a tag",
                usage: "<name> <content>",
                example: ["tags create test1 this is a test tag"],
            },
            args: [
                {
                    id: "name",
                    type: "lowercase",
                    prompt: {
                        start: "Please provide a name for this tag!",
                    },
                },
                {
                    id: "content",
                    prompt: {
                        start: "Please provide the content for this tag! (BE AWARE MENTIONS WONT WORK)",
                    },
                    match: "rest",
                    type: "string",
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { name, content }: { name?: string; content?: string }) {
        if (!name)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed("No Name Provided", "Please provide a valid name for this tag")
            );
        if (!content)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed("No Content Provided", "Please provide the content for this tag")
            );

        name = Util.cleanContent(name.toLowerCase(), message);
        content = Util.cleanContent(content, message);

        const fetchTag = await this.client.tagHandler.fetch(message.guild!, { name: name });
        if (fetchTag)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "That tag already exists!",
                    "Please choose a different name for your tag or delete the existing one"
                )
            );

        await this.client.tagHandler.create(message.guild!, {
            creator: message.author,
            content: content,
            name: name,
        });

        return message.channel.send(
            new this.client.Embeds.SuccessEmbed("Tag Successfully Added", `Tag \`${name}\` has been added!`, message)
        );
    }
}
