import { Command } from "discord-akairo";
import { GuildMember, Message } from "discord.js";

export default class Kick extends Command {
    public constructor() {
        super("kick", {
            aliases: ["kick"],
            category: "moderation",
            description: {
                content: "Kick a member from this server",
                usage: "<@user|id|username> [...reason]",
                examples: ["kick @ociN#3727 being mean", "kick 500765481788112916 being mean", "kick Nico being mean"],
            },
            ratelimit: 5,
            cooldown: 20000,
            args: [
                {
                    id: "member",
                    type: "member",
                },
                {
                    id: "reason",
                    match: "rest",
                    type: "string",
                },
            ],
            channel: "guild",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
        });
    }

    public async exec(message: Message, { member, reason }: { member?: GuildMember; reason: string }) {
        if (!member)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_MEMBER, null)
            );
        if (member.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("kick"));

        if (!member.kickable)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(null, this.client.Responses.NOT_ACTIONABLE("kick"))
            );

        if (message.member!.roles.highest.position < member.roles.highest.position)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    this.client.Responses.INSUFFICENT_PERMISSIONS_HEADING,
                    this.client.Responses.INSUFFICENT_PERMISSIONS_BODY
                )
            );

        await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            type: "kick",
            user: member.user,
        });
        await member.kick(reason);
        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "Member Successfully Kicked",
                this.client.Responses.NEW_MODACTION_RESPONSE("kicked", member.user, reason),
                message
            )
        );
    }
}
