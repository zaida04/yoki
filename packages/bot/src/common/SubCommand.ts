import { CommandOptions } from "discord-akairo";
import { Command } from "discord-akairo";

export default class SubCommand extends Command {
    public subCommands: string[][];

    public constructor(name: string, options: SubCommandOptions) {
        super(name, options);
        this.subCommands = options.subCommands;
    }
}

interface SubCommandOptions extends CommandOptions {
    subCommands: string[][];
}
