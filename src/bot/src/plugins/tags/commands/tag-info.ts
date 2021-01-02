import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

import { Message } from "discord.js";

export default class tagInfo extends Command {
    public constructor() {
        super("tag-info", {
            category: "tags",
            module: "tags",
            description: {
                content: "Retrieve a tag by either ID or name",
                usage: "<id | name>",
                example: ["tags fetch 345", "tags fetch test123"],
            },
            args: [
                {
                    id: "name",
                    match: "content",
                    type: "string",
                },
            ],
            channel: "guild",
        });
    }

    public async exec(message: Message, { name }: { name?: string }) {
        if (!name) return message.channel.send(new this.client.Embeds.ErrorEmbed("Please provide a tag name!"));
        const fetch_tag = await this.client.tagHandler.fetch(message.guild!, { name });
        if (!fetch_tag)
            return message.channel.send(new this.client.Embeds.ErrorEmbed("Invalid!", "That tag doesn't exist!"));

        return message.channel.send(
            new MessageEmbed()
                .setTitle(`Info for tag`)
                .setColor("BLUE")
                .setDescription(
                    `
                **ID:** **${fetch_tag.id}**
                **Name:** \`${fetch_tag.name}\`
                **Content:** \`${fetch_tag.content}\`
                **Created By:** ${await this.client.users.fetch(fetch_tag.creator_id)}
                **Created On:** ${new Date(fetch_tag.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                `,
                ),
        );
    }
}
