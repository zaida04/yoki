import { Flag } from "discord-akairo";
import { hasAnyPermission } from "../../../../common/PermissionUtil";
import SubCommand from "../../../../common/SubCommand";

export default class Cases extends SubCommand {
    public constructor() {
        super("cases", {
            aliases: ["cases", "actions", "case"],
            category: "moderation",
            module: "moderation",
            description: {
                content: "Interact with this server's cases",
                usage: "<subcommand> [...args]",
                example: ["cases fetch 12", "cases delete 12", "cases edit 12"],
            },
            subCommands: [
                ["case-delete", "delete"],
                ["case-fetch", "fetch"],
                ["case-claim", "claim"],
                ["case-history", "history"],
            ],
            channel: "guild",
            userPermissions: (message) =>
                hasAnyPermission(message.member!, ["MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS"]),
        });
    }

    public *args() {
        const method = yield {
            type: this.subCommands,
            otherwise: new this.client.Embeds.SubCommand(this),
        };

        return Flag.continue(method);
    }
}
