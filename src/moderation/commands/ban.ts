import { Command } from "discord-akairo";
import { User, Message } from "discord.js";

export default class Ban extends Command {
    public constructor() {
        super("ban", {
            aliases: ["ban"],
            category: "moderation",
            description: {
                content: "Ban a user from this server",
                usage: "<@user> [...reason]",
                example: ["ban @ociN#3727 being mean", "ban 500765481788112916 being mean", "ban Nico being mean"],
            },
            args: [
                {
                    id: "user",
                    type: "user",
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

    public async exec(message: Message, { user, reason }: { user?: User; reason?: string }) {
        if (!user)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (user.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("ban"));
        const member = message.guild!.member(user);

        if (member) {
            if (!member.bannable)
                return message.channel.send(
                    new this.client.Embeds.ErrorEmbed(null, this.client.Responses.NOT_ACTIONABLE("bann"))
                );

            if (message.member!.roles.highest.position < member.roles.highest.position)
                return message.channel.send(
                    new this.client.Embeds.ErrorEmbed(
                        this.client.Responses.INSUFFICENT_PERMISSIONS_HEADING,
                        this.client.Responses.INSUFFICENT_PERMISSIONS_BODY
                    )
                );
        }

        await message.guild!.members.ban(user, { reason: reason });
        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully Banned",
                this.client.Responses.NEW_MODACTION_RESPONSE("banned", user, reason),
                message
            )
        );
    }
}
