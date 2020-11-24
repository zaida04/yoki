import { Flag } from "discord-akairo";
import SubCommand from "../../common/SubCommand";

export default class Tickets extends SubCommand {
    public constructor() {
        super("tickets", {
            aliases: ["ticket", "tickets"],
            category: "ticketing",
            module: "ticketing",
            description: {
                content: "Interact with this server's tickets",
                usage: "<subcommand> [...args]",
                example: ["ticket open", "ticket close", "ticket close #channel"],
            },
            subCommands: [
                ["ticket-close", "close"],
                ["ticket-open", "open"],
                ["ticket-fetch", "fetch"],
                ["ticket-create", "create"],
                ["ticket-add", "add"],
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
