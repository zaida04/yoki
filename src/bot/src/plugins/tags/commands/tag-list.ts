import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";

import { Message } from "discord.js";
import { DatabaseTagEntry } from "../typings/tag";

export default class tagList extends Command {
    public constructor() {
        super("tag-list", {
            category: "tags",
            module: "tags",
            description: {
                content: "Get list of tags from this guild or from a users",
                usage: "[@user]",
                example: ["tags list", "tags list @ociN#3727", "tags list nico"],
            },
            args: [
                {
                    id: "target",
                    type: "member",
                },
            ],
            channel: "guild",
        });
    }

    public async exec(message: Message, { target }: { target?: GuildMember }) {
        const embed = new MessageEmbed();
        if (target) {
            const user_tags: DatabaseTagEntry[] = await this.client.db.api<DatabaseTagEntry>("tags").where({
                guild_id: message.guild!.id,
                creator_id: target.id,
            });
            embed
                .setColor("GREEN")
                .setTitle(`Tags for that User`)
                .setDescription(
                    `
                    ${user_tags.length < 0 ? "No Tags" : user_tags.map((x) => `\`${x.name}\``).join(", ")}
                    `
                );
        } else {
            const guild_tags: DatabaseTagEntry[] = await this.client.db
                .api<DatabaseTagEntry>("tags")
                .where("guild_id", message.guild!.id);
            embed
                .setColor("GOLD")
                .setTitle(`Tags for this server`)
                .setDescription(
                    `
                ${guild_tags.length < 0 ? "No Tags" : guild_tags.map((x) => `\`${x.name}\``).join(", ")}
                `
                );
        }

        return message.channel.send(embed);
    }
}
