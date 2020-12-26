import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";
import ms from "@naval-base/ms";
import { Message } from "discord.js";

import ActionEmbed from "../../structures/ActionEmbed";

export default class Mute extends Command {
    public constructor() {
        super("mute", {
            aliases: ["mute"],
            module: "moderation",
            category: "moderation",
            description: {
                content: "mute a member of this server",
                usage: "<@member> [...reason]",
                example: ["mute @ociN#3727 annoying"],
            },
            args: [
                {
                    id: "target",
                    type: "member",
                },
                {
                    // Taken from https://github.com/Naval-Base/yuudachi/blob/master/src/bot/commands/mod/mute.ts#L31
                    id: "duration",
                    type: (_, str): number | null => {
                        if (!str) return null;
                        const duration = ms(str);
                        if (duration && duration >= 100000 && !isNaN(duration)) return duration;
                        return null;
                    },
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
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(
        message: Message,
        {
            target,
            duration,
            reason,
            hidden,
        }: { target?: GuildMember; duration?: number | null; reason?: string; hidden?: boolean }
    ) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("mute"));
        if (!duration) return message.channel.send("Please input a time longer than 100 seconds");

        const mutedRoleID = await message.guild!.settings.get<string>("muteRole");
        if (!mutedRoleID)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "No mute role set!",
                    `You can set one by doing the command \`settings mute-role @role\``
                )
            );

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            message: null,
            expiration_date: new Date(Date.now() + duration),
            type: "mute",
            target: target.user,
        });

        if (!hidden)
            await target
                .send(
                    `
                You have been \`muted\` in **${message.guild!.name}**\n\n${reason ? `Reason: **${reason}**` : ""}
                `
                )
                .catch((e) => e);

        const mutedRole = await message.guild!.roles.fetch(mutedRoleID);
        mutedRole ? await target.roles.add(mutedRole) : void 0;

        const logChannel = await message.guild!.settings.channel<TextChannel>("modLogChannel", "text");
        const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
        if (logMessage) {
            void this.client.caseActions.updateMessage(createdCase, logMessage);
        }
        this.client.caseActions.cache.delete(createdCase.id);

        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully Muted",
                this.client.Responses.NEW_MODACTION_RESPONSE("muted", target.user, reason),
                message
            ).setFooter(`Case-ID: ${createdCase.id}`)
        );
    }
}
