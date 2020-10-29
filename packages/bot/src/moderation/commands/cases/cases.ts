import { Flag } from "discord-akairo";
import { Command } from "discord-akairo";

export default class Cases extends Command {
    public constructor() {
        super("cases", {
            aliases: ["cases", "actions"],
            category: "moderation",
            description: {
                content: "Interact with this server's cases",
                usage: "<subcommand> [...args]",
                examples: ["cases fetch 12", "cases delete 12", "cases edit 12"],
            },
            subCommands: [
                ["cases-delete", "delete"],
                ["cases-fetch", "fetch"],
            ],
            channel: "guild",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
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
