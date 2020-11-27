import { Command } from "discord-akairo";
import { Role } from "discord.js";
import { GuildEmoji } from "discord.js";

import { Message } from "discord.js";

export default class ReactionRole extends Command {
    public constructor() {
        super("reaction-remove", {
            category: "reaction-role",
            module: "reactions",
            description: {
                content: "remove a reaction role to a message",
                usage: "<message> <reaction> <role>",
                example: ["reaction remove 779060485718016013 :custom_reaction: 732716995761668209"],
            },
            args: [
                {
                    id: "msg",
                    type: "message",
                },
                {
                    id: "emoji",
                    type: "emoji",
                },
                {
                    id: "role",
                    type: "role",
                },
            ],
            channel: "guild",
        });
    }

    public async exec(message: Message, { msg, emoji, role }: { msg: Message; emoji: GuildEmoji; role: Role }) {
        await this.client.db.api("reaction_roles").where({
            guild_id: message.guild!.id,
            message_id: msg.id,
            reaction: emoji.name,
            role: role.id,
        });
        return message.channel.send("Reaction Role will be deleted if exists in the system.");
    }
}
