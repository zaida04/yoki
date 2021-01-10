import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";

import { Message } from "discord.js";
import { hasAnyPermission } from "../../../../common/PermissionUtil";

import ActionEmbed from "../../structures/ActionEmbed";

export default class Warn extends Command {
    public constructor() {
        super("warn", {
            aliases: ["warn"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "warn a user in this server",
                usage: "<@user> [...reason]",
                example: ["warn @ociN#3727 annoying"],
            },
            args: [
                {
                    id: "target",
                    type: "member",
                },
                {
                    id: "reason",
                    match: "rest",
                    type: "string",
                },
                {
                    id: "hidden",
                    match: "flag",
                    flag: "--hidden",
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: (message) =>
                hasAnyPermission(message.member!, ["MANAGE_MESSAGES", "BAN_MEMBERS", "KICK_MEMBERS"]),
            channel: "guild",
        });
    }

    public async exec(
        message: Message,
        { target, reason, hidden }: { target?: GuildMember; reason?: string; hidden?: boolean },
    ) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("warn"));

        const createdCase = await this.client.moderation.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            message: null,
            expiration_date: null,
            type: "warn",
            target: target.user,
        });

        if (!hidden)
            void target
                .send(
                    `
                You have been \`warned\` in **${message.guild!.name}**\n${
                        reason ? `Reason: **${reason}**\n` : ""
                    }**\n*Please ensure you comply with this servers rules*
                `,
                )
                .catch((e) => e);

        const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");
        const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
        if (logMessage) {
            void this.client.moderation.caseActions.updateMessage(createdCase, logMessage);
        }
        this.client.moderation.caseActions.cache.delete(createdCase.id);

        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully Warned",
                this.client.Responses.NEW_MODACTION_RESPONSE("warnned", target.user, reason),
                message,
            ).setFooter(`Case-ID: ${createdCase.id}`),
        );
    }
}
