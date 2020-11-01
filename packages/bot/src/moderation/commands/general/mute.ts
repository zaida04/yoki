import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";

import { Message } from "discord.js";
import { retrieveModLogChannel } from "../../../common/retrieveChannel";
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
            ],
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { target, reason }: { target?: GuildMember; reason?: string }) {
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
            user: target.user,
        });

        const mutedRole = await message.guild!.roles.fetch(mutedRoleID);
        mutedRole ? await target.roles.add(mutedRole) : void 0;

        const logChannel = await retrieveModLogChannel(message.guild!);
        const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
        if (logMessage) {
            this.client.caseActions.updateMessage(createdCase, logMessage);
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
