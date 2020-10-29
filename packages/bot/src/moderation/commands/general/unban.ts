import { Command } from "discord-akairo";

import { User, Message } from "discord.js";

export default class UnBan extends Command {
    public constructor() {
        super("unban", {
            aliases: ["unban"],
            category: "moderation",
            description: {
                content: "unban a user from this server",
                usage: "<@user> [...reason]",
                example: ["unban @ociN#3727 accidental ban"],
            },
            args: [
                {
                    id: "target",
                    type: async (_, id) => {
                        const user = await this.client.users.fetch(id).catch();
                        return user;
                    },
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

    public async exec(message: Message, { target, reason }: { target?: User; reason?: string }) {
        if (!target)
            return message.channel.send(new this.client.Embeds.ErrorEmbed(this.client.Responses.INCORRECT_USER, null));
        if (target.id === message.author.id) return message.channel.send(this.client.Responses.SELF_ACTION("unban"));

        const createdCase = await this.client.caseActions.create({
            guild: message.guild!,
            reason: reason,
            executor: message.author,
            type: "unban",
            user: target,
        });
        await message.guild!.members.unban(target, reason);
        return message.reply(
            new this.client.Embeds.SuccessEmbed(
                "User Successfully Unbanned",
                this.client.Responses.NEW_MODACTION_RESPONSE("unbanned", target, reason),
                message
            ).setFooter(`Case-ID: ${createdCase.id}`)
        );
    }
}
