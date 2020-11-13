import { Flag } from "discord-akairo";
import SubCommand from "../../common/SubCommand";

export default class Tags extends SubCommand {
    public constructor() {
        super("tags", {
            aliases: ["tags", "tag"],
            category: "tags",
            module: "tags",
            description: {
                content: "Interact with this server's tags",
                usage: "<subcommand> [...args]",
                example: ["tag fetch 12", "tags delete 12", "tags fetch 12"],
            },
            subCommands: [
                ["tag-delete", "delete"],
                ["tag-show", "show"],
                ["tag-info", "info"],
                ["tag-create", "create"],
            ],
            channel: "guild",
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
