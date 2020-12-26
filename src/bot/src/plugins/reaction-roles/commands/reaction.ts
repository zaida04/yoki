import { Flag } from "discord-akairo";
import SubCommand from "../../../common/SubCommand";

export default class ReactionRoles extends SubCommand {
    public constructor() {
        super("reaction-roles", {
            aliases: ["reaction", "reaction-roles", "reactions", "rr"],
            category: "reaction-role",
            module: "reactions",
            description: {
                content: "Interact with this server's reaction roles",
                usage: "<subcommand> [...args]",
                example: ["reaction add 779060485718016013 :custom_reaction: 732716995761668209"],
            },
            subCommands: [
                ["reaction-add", "add"],
                ["reaction-remove", "remove"],
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
