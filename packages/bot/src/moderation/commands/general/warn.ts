import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";

import { Message } from "discord.js";
import { retrieveModLogChannel } from "../../../common/retrieveChannel";
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
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { target, reason }: { target?: GuildMember; reason?: string }) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("warn"));

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            message: null,
            type: "warn",
            user: target.user,
        });

        const logChannel = await retrieveModLogChannel(message.guild!);
        const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
        if (logMessage) {
            this.client.caseActions.updateMessage(createdCase, logMessage);
        }
        this.client.caseActions.cache.delete(createdCase.id);

        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully Warned",
                this.client.Responses.NEW_MODACTION_RESPONSE("warnned", target.user, reason),
                message
            ).setFooter(`Case-ID: ${createdCase.id}`)
        );
    }
}
