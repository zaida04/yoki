import { Command } from "discord-akairo";

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
                    prompt: {
                        start: "Please give me the id of a message you wish to remove the reaction role from",
                    },
                },
                {
                    id: "emoji",
                    type: "emoji",
                    prompt: {
                        start:
                            "Please give me the emoji that gives a reaction role that exists on that message.\n**Ensure this emoji is IN THIS SERVER**",
                    },
                },
            ],
            channel: "guild",
        });
    }

    public async exec(message: Message, { msg, emoji }: { msg: Message; emoji: GuildEmoji }) {
        await msg.fetch();
        const reaction = msg.reactions.cache.has(emoji.id)
            ? msg.reactions.cache.get(emoji.id)
            : msg.reactions.cache.has(emoji.name)
            ? msg.reactions.cache.get(emoji.name)
            : null;
        if (!reaction) return message.channel.send("That emoji doesn't exist on that message");
        void reaction.remove();
        void this.client.db
            .api("reaction_roles")
            .where({
                guild_id: message.guild!.id,
                message_id: msg.id,
                reaction: emoji.name,
            })
            .del();
        return message.channel.send("Reaction Role will be deleted if exists in the system.");
    }
}
