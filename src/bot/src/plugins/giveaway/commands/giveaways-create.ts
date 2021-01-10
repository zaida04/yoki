import ms from "@naval-base/ms";
import { stripIndents } from "common-tags";
import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { GuildEmoji } from "discord.js";
import { Message } from "discord.js";
import { hasAnyPermission } from "../../../common/PermissionUtil";
import { YokiColors } from "../../../common/YokiColors";

export default class GiveawayCreate extends Command {
    public constructor() {
        super("giveaways-create", {
            category: "giveaways",
            module: "giveaways",
            description: {
                content: "Create a giveaway!",
                usage: "",
                example: [],
            },
            args: [
                {
                    id: "channel",
                    type: "textChannel",
                    prompt: {
                        start:
                            "Welcome to the interactive giveaway maker for Yoki! Please say the answers below to each of my questions.\n\nLet's start off with what channel do you want this giveaway to be sent to?",
                    },
                },
                {
                    id: "title",
                    type: "string",
                    prompt: {
                        start:
                            "What do you want the title of the giveaway to be? If you say `none`, it'll be defaulted to `A new giveaway!`",
                    },
                },
                {
                    id: "description",
                    type: "string",
                    prompt: {
                        start: "Please provide a description for what this giveaway entails, such as the rewards.",
                    },
                },
                {
                    id: "emoji",
                    type: "emoji",
                    prompt: {
                        start:
                            'Please tell me what emoji you want to use as the "entry emote" that\'ll enter people into the giveaway. **Please only use emotes that are in this server, otherwise I might not be able to access them**',
                    },
                },
                {
                    id: "winner_num",
                    type: "integer",
                    prompt: {
                        start: "Please tell me how many winners you want this giveaway to have.",
                    },
                },
                {
                    id: "expiration",
                    type: (_, str): number | null => {
                        if (!str) return null;
                        const duration = ms(str);
                        if (
                            duration &&
                            duration >= this.client.giveaways.scheduler.checkRate * 1000 &&
                            !isNaN(duration)
                        )
                            return duration;
                        return null;
                    },
                    prompt: {
                        start: "And finally, when do you want this giveaway to end? It must be longer than 5 minutes",
                    },
                },
            ],
            channel: "guild",
            userPermissions: (message) => hasAnyPermission(message.member!, ["MANAGE_MESSAGES", "MANAGE_GUILD"]),
        });
    }

    public async exec(
        message: Message,
        {
            title,
            description,
            emoji,
            winner_num,
            expiration,
            channel,
        }: {
            title: string;
            description: string;
            emoji: GuildEmoji;
            winner_num: number;
            expiration: number;
            channel: TextChannel;
        },
    ) {
        const exp_date = new Date(Date.now() + expiration);
        try {
            const created_giveaway = await this.client.giveaways.create({
                guild: message.guild!,
                channel,
                title,
                description,
                emoji,
                winner_count: winner_num,
                expiration_date: exp_date,
                creator: message.author,
            });

            return message.channel.send(
                new MessageEmbed().setColor(YokiColors.GREEN).setTitle("Successfully created giveaway!")
                    .setDescription(stripIndents`
                [New Giveaway](${created_giveaway.url}) 

                **Started By:** ${message.author}
                **Entry emote:** ${emoji}
                **Number of winners:** ${winner_num}
                **Expires at:** ${exp_date.toISOString()}
                `),
            );
        } catch (e) {
            throw e;
        }
    }
}
