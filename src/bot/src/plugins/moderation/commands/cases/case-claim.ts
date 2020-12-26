import { Command } from "discord-akairo";

import { Message } from "discord.js";
import { hasAnyPermission } from "../../../../common/PermissionUtil";
import { ActionType } from "../../typings/Action";
import ActionEmbed from "../../structures/ActionEmbed";
import { TextChannel } from "discord.js";

export default class CaseClaim extends Command {
    public constructor() {
        super("case-claim", {
            category: "moderation",
            module: "moderation",
            description: {
                content: "Claim a case",
                usage: "<message_id>",
                example: ["cases fetch 345"],
            },
            args: [
                {
                    id: "fetchMessage",
                    type: "guildMessage",
                    default: async (message: Message) => {
                        return (
                            await message.guild?.settings.channel<TextChannel>("modLogChannel", "text")
                        )?.messages.fetch({ limit: 1 });
                    },
                    prompt: {
                        start:
                            "Please provide the id of a message in this guild that is an `Unknown Executor` Embed *(say it below)*",
                    },
                },
                {
                    id: "reason",
                    match: "rest",
                    type: "string",
                    prompt: {
                        start: "What's the reason for claiming this case?",
                    },
                },
            ],
            userPermissions: (message) =>
                hasAnyPermission(message.member!, ["MANAGE_MESSAGES", "MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS"]),
            channel: "guild",
        });
    }

    public async exec(message: Message, { fetchMessage, reason }: { fetchMessage?: Message; reason?: string }) {
        if (!fetchMessage)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Provide an ID!",
                    "Please provide an ID pointing to a valid message sent by this bot of an unclaimed action"
                )
            );

        if (fetchMessage.author.id !== this.client.user!.id)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Invalid ID!",
                    "That message was not sent by me, and as such can not be an unclaimed case from my system!"
                )
            );
        const existingData = fetchMessage.embeds[0];
        if (existingData.author?.name !== "Unknown Executor")
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Error!",
                    "Could not parse message. Make sure this message has an embed that starts with **Unknown Executor** and was sent by me!"
                )
            );
        const rows = existingData.description!.split("\n");

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            target: await this.client.users.fetch(
                rows
                    .find((x) => x.trim().startsWith("**Target:**"))!
                    .replace(" ", "")
                    .split("**Target:**")[1]!
                    .replace("<@", "")
                    .replace(">", "")
                    .split(" ")[0]!
                    .trim()
            ),
            type: rows
                .find((x) => x.trim().startsWith("**Type:**"))!
                .replace(/`/g, "")
                .split("**Type:**")[1]!
                .replace(/`/g, "")
                .trim() as ActionType,
            executor: message.author,
            reason: reason,
            expiration_date: null,
            message: fetchMessage,
        });

        void fetchMessage.edit({ embed: new ActionEmbed(createdCase) });

        return message.channel.send(
            new this.client.Embeds.SuccessEmbed("Success!", "You have successfully claimed this case.", message)
        );
    }
}
