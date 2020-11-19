import { Command } from "discord-akairo";
import { ReactionEmoji } from "discord.js";

import { Role } from "discord.js";
import { GuildEmoji } from "discord.js";

import { Message } from "discord.js";

export default class ReactionRole extends Command {
    public constructor() {
        super("reaction-add", {
            category: "reaction-role",
            module: "reactions",
            description: {
                content: "Add a reaction role to a message",
                usage: "<message> <reaction> <role>",
                example: ["reaction add 779060485718016013 :custom_reaction: 732716995761668209"],
            },
            args: [
                {
                    id: "msg",
                    type: "guildMessage",
                    prompt: {
                        start:
                            "Welcome to the interactive setup for Reaction Roles! *(Please answer the questions below)*\n\nPlease give the id of a message in this server ",
                    },
                },
                {
                    id: "emoji",
                    type: "emoji",
                    prompt: {
                        start: "Please say the Emoji Reaction that you wish to trigger the role giving",
                    },
                },
                {
                    id: "role",
                    type: "role",
                    prompt: {
                        start: "Please say the role in which you wish to add to the person",
                    },
                },
            ],
            channel: "guild",
        });
    }

    public async exec(
        message: Message,
        { msg, emoji, role }: { msg: Message; emoji: GuildEmoji | ReactionEmoji; role: Role }
    ) {
        const [id] = await this.client.rrHandler.create({
            message_id: msg.id,
            reaction: emoji.id ?? emoji.name,
            guild_id: message.guild!.id,
            role_id: role.id,
        });
        void msg.react(emoji.id ?? emoji.name);
        const embed = new this.client.Embeds.SuccessEmbed(
            "Reaction Role Added",
            `[This Message](${msg.url}) will now give the ${role} when someone reacts with`,
            message
        ).setFooter(`RR ID: ${id}`);
        emoji instanceof GuildEmoji ? embed.setImage(emoji.url) : void 0;

        return message.channel.send(embed);
    }
}
