import { Flag } from "discord-akairo";
import SubCommand from "../../common/SubCommand";

export default class Tags extends SubCommand {
    public constructor() {
        super("filter", {
            aliases: ["filter", "message-filter"],
            category: "messageFilter",
            module: "messageFilter",
            description: {
                content: "Interact with this server's message filter",
                usage: "<subcommand> [...args]",
                example: ["filter add word1", "filter remove word1"],
            },
            subCommands: [
                ["filter-remove", "remove"],
                ["filter-add", "add"],
                ["filter-list", "list"],
                ["filter-automod", "automod"],
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
