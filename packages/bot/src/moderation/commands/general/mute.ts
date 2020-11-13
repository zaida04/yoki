import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";

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
        { target, reason, hidden }: { target?: GuildMember; reason?: string; hidden?: boolean }
    ) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("mute"));

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
            type: "mute",
            target: target.user,
        });

        if (!hidden)
            await target
                .send(`You have been \`muted\` in **${message.guild!.name}**\n\nReason: ${reason}`)
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
