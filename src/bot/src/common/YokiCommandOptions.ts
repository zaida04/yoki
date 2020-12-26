import { CommandOptions } from "discord-akairo";

export interface YokiCommandOptions extends CommandOptions {
    premium?: boolean;
    description: {
        usage: string;
        content: string;
        example: string[];
    };
}
