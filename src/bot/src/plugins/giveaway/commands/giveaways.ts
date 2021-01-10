import { Flag } from "discord-akairo";
import SubCommand from "../../../common/SubCommand";

export default class Giveaways extends SubCommand {
    public constructor() {
        super("giveaways", {
            aliases: ["giveaways", "giveaway"],
            category: "giveaways",
            module: "giveaways",
            description: {
                content: "Interact with this servers giveaways",
                usage: "<subcommand> [...args]",
                example: ["giveaways create"],
            },
            subCommands: [
                ["giveaways-create", "create"],
                ["giveaways-end", "end"],
                ["giveaways-cancel", "cancel"],
                ["giveaways-reroll", "reroll"],
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
