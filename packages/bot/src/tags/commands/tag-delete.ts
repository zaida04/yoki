import { Command } from "discord-akairo";

import { Message } from "discord.js";

export default class tagInfo extends Command {
    public constructor() {
        super("tag-delete", {
            category: "tags",
            module: "tags",
            description: {
                content: "Delete a tag",
                usage: "<name>",
                example: ["tags delete test123"],
            },
            args: [
                {
                    id: "name",
                    type: "string",
                    prompt: {
                        optional: true,
                        start: "What tag do you wish to delete?",
                    },
                },
            ],
            channel: "guild",
            userPermissions: "MANAGE_GUILD",
        });
    }

    public async exec(message: Message, { name }: { name?: string }) {
        if (!name) return message.channel.send(new this.client.Embeds.ErrorEmbed("Please provide a tag name!"));
        const fetch_tag = await this.client.tagHandler.fetch(message.guild!, { name });
        if (!fetch_tag)
            return message.channel.send(new this.client.Embeds.ErrorEmbed("Invalid!", "That tag doesn't exist!"));

        void this.client.tagHandler.delete(message.guild!, fetch_tag.id);
        return message.channel.send("Tag is scheduled for deletion.");
    }
}
