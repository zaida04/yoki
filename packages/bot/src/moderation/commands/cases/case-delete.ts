import { Command } from "discord-akairo";

import { Message } from "discord.js";
import { hasAnyPermission } from "../../../common/PermissionUtil";
import ActionEmbed from "../../structures/ActionEmbed";

export default class CaseDelete extends Command {
    public constructor() {
        super("case-delete", {
            aliases: ["pardon"],
            module: "moderation",
            category: "moderation",
            description: {
                content: "Delete a case by ID",
                usage: "<id> [...reason]",
                example: ["cases delete 345"],
            },
            args: [
                {
                    id: "id",
                    type: "string",
                },
                {
                    id: "reason",
                    match: "rest",
                    type: "string",
                },
            ],
            userPermissions: (message) =>
                hasAnyPermission(message.member!, ["MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS"]),
            channel: "guild",
        });
    }

    public async exec(message: Message, { id, reason }: { id?: string; reason?: string }) {
        if (!id) return message.channel.send(new this.client.Embeds.ErrorEmbed("Please provide a case ID."));
        const fetchCase = await this.client.caseActions.fetch(message.guild!.id, id);

        if (!fetchCase)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed("Invalid ID", "That ID does not belong to a case in this guild.")
            );
        await this.client.caseActions.delete(message.guild!.id, id);
        if (fetchCase.message && !fetchCase.message.deleted) void fetchCase.message.delete();

        switch (fetchCase.type) {
            case "ban": {
                void this.client.commandHandler.runCommand(
                    message,
                    this.client.Modules.get("moderation")!.commands.get("unban")!,
                    {
                        target: fetchCase.user,
                        reason: reason,
                    }
                );
            }
            case "mute": {
                const mutedRoleID = await message.guild!.settings.get<string>("muteRole");
                const mutedRole = mutedRoleID ? await message.guild!.roles.fetch(mutedRoleID) : null;
                if (mutedRole) {
                    void (await message.guild!.members.fetch(fetchCase.user)).roles.remove(mutedRole);
                }

                return message.channel.send(
                    new this.client.Embeds.SuccessEmbed(
                        "User Successfully unmuted",
                        this.client.Responses.NEW_MODACTION_RESPONSE("unmuted", fetchCase.user, reason),
                        message
                    ).setFooter(`Case-ID: ${fetchCase.id}`)
                );
            }

            default: {
                return message.channel.send(
                    `\`Deleted case ${id} for you! Here it is for reference.\``,
                    new ActionEmbed(fetchCase)
                );
            }
        }
    }
}
