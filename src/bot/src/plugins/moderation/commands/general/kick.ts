import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { GuildMember, Message } from "discord.js";

import ActionEmbed from "../../structures/ActionEmbed";

export default class Kick extends Command {
    public constructor() {
        super("kick", {
            aliases: ["kick"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "Kick a member from this server",
                usage: "<@member> [...reason]",
                example: ["kick @ociN#3727 being mean", "kick 500765481788112916 being mean", "kick Nico being mean"],
            },
            ratelimit: 5,
            cooldown: 20000,
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
            channel: "guild",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
        });
    }

    public async exec(
        message: Message,
        { target, reason, hidden }: { target?: GuildMember; reason: string; hidden?: boolean },
    ) {
        if (!target)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_MEMBER, null),
            );
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("kick"));

        if (!target.kickable)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(null, this.client.Responses.NOT_ACTIONABLE("kick")),
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
            message: null,
            expiration_date: null,
            type: "kick",
            target: target.user,
        });
        if (!hidden)
            await target
                .send(
                    `You have been \`kicked\` in **${message.guild!.name}**\n\n${
                        reason ? `Reason: **${reason}**` : ""
                    }`,
                )
                .catch((e) => e);

        await target.kick(`Kick case: ${createdCase.id} ${reason ? `| ${reason}` : ""}`);

        const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");
        const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
        if (logMessage) {
            void this.client.caseActions.updateMessage(createdCase, logMessage);
        }
        this.client.caseActions.cache.delete(createdCase.id);

        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "Member Successfully Kicked",
                this.client.Responses.NEW_MODACTION_RESPONSE("kicked", target.user, reason),
                message,
            ).setFooter(`Case-ID ${createdCase.id}`),
        );
    }
}
