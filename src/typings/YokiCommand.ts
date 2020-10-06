import { Command } from "discord-akairo";

export interface YokiCommand extends Command {
    premium?: boolean;
    description: {
        usage: string;
        content: string;
        example: string[];
    };
}
