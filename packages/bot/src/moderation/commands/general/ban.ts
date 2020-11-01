import { Argument } from "discord-akairo";
import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";
import { User, Message } from "discord.js";
import { retrieveModLogChannel } from "../../../common/retrieveChannel";
import ActionEmbed from "../../structures/ActionEmbed";

export default class Ban extends Command {
    public constructor() {
        super("ban", {
            aliases: ["ban"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "Ban a user from this server",
                usage: "<@user> [...reason]",
                example: ["ban @ociN#3727 being mean", "ban 500765481788112916 being mean", "ban Nico being mean"],
            },
            args: [
                {
                    id: "target",
                    /*
                    Credit to https://github.com/Naval-Base/yuudachi/blob/master/src/bot/commands/mod/ban.ts#L22
                    Created and maintained by iCrawl <icrawltogo@gmail.com>
                    */
                    type: Argument.union("member", "user", async (_, phrase) => {
                        try {
                            return await this.client.users.fetch(phrase);
                        } catch (e) {
                            return null;
                        }
                    }),
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

    public async exec(message: Message, { target, reason }: { target?: User | GuildMember; reason?: string }) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("ban"));

        if (target instanceof GuildMember) {
            if (!target.bannable)
                return message.channel.send(
                    new this.client.Embeds.ErrorEmbed(null, this.client.Responses.NOT_ACTIONABLE("bann"))
                );

            if (message.member!.roles.highest.position < target.roles.highest.position)
                return message.channel.send(
                    new this.client.Embeds.ErrorEmbed(
                        this.client.Responses.INSUFFICENT_PERMISSIONS_HEADING,
                        this.client.Responses.INSUFFICENT_PERMISSIONS_BODY
                    )
                );
        }

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            message: null,
            type: "ban",
            user: target instanceof GuildMember ? target.user : target,
        });

        await message.guild!.members.ban(target, {
            reason: `Ban case: ${createdCase.id} ${reason ? `| ${reason}` : ""}`,
        });

        const logChannel = await retrieveModLogChannel(message.guild!);
        const logMessage = await logChannel?.send(new ActionEmbed(createdCase));
        if (logMessage) {
            this.client.caseActions.updateMessage(createdCase, logMessage);
        }
        this.client.caseActions.cache.delete(createdCase.id);

        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully Banned",
                this.client.Responses.NEW_MODACTION_RESPONSE(
                    "banned",
                    target instanceof GuildMember ? target.user : target,
                    reason
                ),
                message
            ).setFooter(`Case-ID ${createdCase.id}`)
        );
    }
}
