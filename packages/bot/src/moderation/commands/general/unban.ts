import { Command } from "discord-akairo";
import { DiscordAPIError } from "discord.js";

import { TextChannel } from "discord.js";

import { User, Message } from "discord.js";

import ActionEmbed from "../../structures/ActionEmbed";

export default class UnBan extends Command {
    public constructor() {
        super("unban", {
            aliases: ["unban"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "unban a user from this server",
                usage: "<@user> [...reason]",
                example: ["unban @ociN#3727 accidental ban"],
            },
            args: [
                {
                    id: "target",
                    type: async (_, id) => {
                        const user = await this.client.users.fetch(id).catch();
                        return user;
                    },
                },
                {
                    id: "reason",
                    match: "rest",
                    type: "string",
                },
            ],
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { target, reason }: { target?: User; reason?: string }) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("unban"));

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            message: null,
            type: "unban",
            target: target,
        });
        try {
            await message.guild!.members.unban(target, reason);

            const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");
            const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
            if (logMessage) {
                void this.client.caseActions.updateMessage(createdCase, logMessage);
            }
            this.client.caseActions.cache.delete(createdCase.id);

            return message.reply(
                new this.client.Embeds.SuccessEmbed(
                    "User Successfully Unbanned",
                    this.client.Responses.NEW_MODACTION_RESPONSE("unbanned", target, reason),
                    message
                ).setFooter(`Case-ID: ${createdCase.id}`)
            );
        } catch (e) {
            if (e instanceof DiscordAPIError) {
                if (e.message === "Unknown Ban")
                    return message.channel.send(
                        new this.client.Embeds.ErrorEmbed("Incorrect Usage", "That person is not banned in this guild!")
                    );
            }
            throw e;
        }
    }
}
