import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { hasAnyPermission } from "../../../common/PermissionUtil";

export default class GiveawayCancel extends Command {
    public constructor() {
        super("giveaways-cancel", {
            category: "giveaways",
            module: "giveaways",
            description: {
                content: "Cancel a giveaway",
                usage: "",
                example: [],
            },
            args: [
                {
                    id: "id",
                    type: "string",
                    prompt: {
                        start: "What's the ID of the giveaway you want to cancel?",
                    },
                },
            ],
            channel: "guild",
            userPermissions: (message) => hasAnyPermission(message.member!, ["MANAGE_MESSAGES", "MANAGE_GUILD"]),
        });
    }

    public async exec(message: Message, { id }: { id: string }) {
        await this.client.giveaways.delete(message.guild!.id, id);
        return message.channel.send("It has been done. Giveaway cancelled, if it exists.");
    }
}
