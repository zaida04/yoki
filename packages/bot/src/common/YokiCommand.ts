import { Command } from "discord-akairo";
import { YokiCommandOptions } from "./YokiCommandOptions";

export default class YokiCommand extends Command {
    public premium?: boolean;

    public constructor(name: string, options: YokiCommandOptions) {
        super(name, options);
        this.premium = options.premium;
    }
}
