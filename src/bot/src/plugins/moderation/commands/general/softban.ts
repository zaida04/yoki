import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";
import { Message } from "discord.js";

import ActionEmbed from "../../structures/ActionEmbed";

export default class SoftBan extends Command {
    public constructor() {
        super("softban", {
            aliases: ["softban"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "softban a user from this server",
                usage: "<@user> [...reason]",
                example: ["softban @ociN#3727 spam", "softban 500765481788112916 mean messages", "softban Nico spam"],
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
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            channel: "guild",
        });
    }

    public async exec(
        message: Message,
        { target, reason, hidden }: { target?: GuildMember; reason?: string; hidden?: boolean },
    ) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("softban"));

        if (!target.bannable)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(null, this.client.Responses.NOT_ACTIONABLE("softbann")),
            );

        if (message.member!.roles.highest.position < target.roles.highest.position)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    this.client.Responses.INSUFFICENT_PERMISSIONS_HEADING,
                    this.client.Responses.INSUFFICENT_PERMISSIONS_BODY,
                ),
            );

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            expiration_date: null,
            message: null,
            type: "softban",
            target: target instanceof GuildMember ? target.user : target,
        });
        if (!hidden)
            await target
                .send(
                    `
                You have been \`softbanned\` in **${message.guild!.name}**\n\n${reason ? `Reason: **${reason}**` : ""}
                `,
                )
                .catch((e) => e);

        await message.guild!.members.ban(target, {
            reason: `Softban case: ${createdCase.id} ${reason ? `| ${reason}` : ""}`,
            days: 1,
        });
        await message.guild!.members.unban(target, `Softban case: ${createdCase.id} | ${reason}`);

        const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");
        const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
        if (logMessage) {
            void this.client.caseActions.updateMessage(createdCase, logMessage);
        }
        this.client.caseActions.cache.delete(createdCase.id);

        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully SoftBanned",
                this.client.Responses.NEW_MODACTION_RESPONSE(
                    "softbanned",
                    target instanceof GuildMember ? target.user : target,
                    reason,
                ),
                message,
            ).setFooter(`Case-ID ${createdCase.id}`),
        );
    }
}
