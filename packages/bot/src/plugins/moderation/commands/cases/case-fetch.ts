import { Command } from "discord-akairo";

import { Message } from "discord.js";
import { hasAnyPermission } from "../../../../common/PermissionUtil";
import ActionEmbed from "../../structures/ActionEmbed";

export default class CaseFetch extends Command {
    public constructor() {
        super("case-fetch", {
            category: "moderation",
            module: "moderation",
            description: {
                content: "Retrieve a case by ID",
                usage: "<id>",
                example: ["cases fetch 345"],
            },
            args: [
                {
                    id: "id",
                    type: "string",
                },
            ],
            userPermissions: (message) =>
                hasAnyPermission(message.member!, ["MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS"]),
            channel: "guild",
        });
    }

    public async exec(message: Message, { id }: { id?: string }) {
        if (!id) return message.channel.send(new this.client.Embeds.ErrorEmbed("Please provide a case ID."));
        const fetchCase = await this.client.caseActions.fetch(message.guild!.id, id);
        if (!fetchCase)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed("Invalid ID", "That ID does not belong to a case in this guild.")
            );

        return message.channel.send(`\`Retrived case ${id} for you!\``, new ActionEmbed(fetchCase));
    }
}
