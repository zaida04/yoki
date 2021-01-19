import { Flag } from "discord-akairo";
import SubCommand from "../../../common/SubCommand";

export default class PrivateVoice extends SubCommand {
    public constructor() {
        super("private-voice", {
            aliases: ["vc", "private-vc", "private-voice"],
            category: "vc",
            module: "private-voice",
            description: {
                content: "Manage the Private Voice channels of this server",
                usage: "<subcommand> [...args]",
                example: ["vc lock", "vc rename newname"],
            },
            subCommands: [
                ["private-voice-lock", "lock"],
                ["private-voice-rename", "rename"],
                ["private-voice-unlock", "unlock"],
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
