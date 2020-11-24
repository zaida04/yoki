import { Flag } from "discord-akairo";
import SubCommand from "../../common/SubCommand";

export default class Suggestions extends SubCommand {
    public constructor() {
        super("suggestions", {
            aliases: ["suggestions", "suggestion", "bug", "report"],
            category: "suggestions",
            module: "suggestions",
            description: {
                content: "Interact with this server's suggestions",
                usage: "<subcommand> [...args]",
                example: ["suggestion create", "suggestion close 234", "ticket accept 234"],
            },
            subCommands: [
                ["suggestion-accept", "accept"],
                ["suggestion-reject", "reject"],
                ["suggestion-create", "create"],
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
