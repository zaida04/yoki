import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";

import { Message } from "discord.js";

export default class Mute extends Command {
    public constructor() {
        super("mute", {
            aliases: ["mute"],
            category: "moderation",
            description: {
                content: "unban a user from this server",
                usage: "<@user> [...reason]",
                example: ["mute @ociN#3727 accidental ban"],
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
            clientPermissions: ["MANAGE_MESSAGES"],
            userPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { target, reason }: { target?: GuildMember; reason?: string }) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("mute"));

        const mutedRole = await message.guild!.settings.get<string>("muteRole");
        if (!mutedRole) return message.channel.send(new this.client.Embeds.ErrorEmbed("No Mute Role Set", null));

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            type: "mute",
            user: target.user,
        });

        await target.roles.add(mutedRole);

        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully Muted",
                this.client.Responses.NEW_MODACTION_RESPONSE("muted", target.user, reason),
                message
            ).setFooter(`Case-ID: ${createdCase.id}`)
        );
    }
}
