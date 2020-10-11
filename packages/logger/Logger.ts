import { LoggerOptions } from "../typings/LoggerOptions";
import colors from "./colors";

export default class Logger {
    private readonly name?: string;
    public constructor(options?: LoggerOptions) {
        this.name = options?.name;
    }

    /*
    [Date] [MemUsed][Name] [Type] <value>
    */

    private base(type: string, value: string, color: string) {
        const used_mem: number = process.memoryUsage().heapUsed / 1024 / 1024;

        let outputBuilder = "";

        outputBuilder += `[${new Date().toLocaleTimeString()}|${new Date().toLocaleDateString()}]${color}${
            colors.DIM
        }`.trim();

        outputBuilder += `[${Math.round(used_mem * 100) / 100} MB]${this.name ? `[${this.name}]` : ""}[${type}]:${
            colors.BRIGHT
        }`.trim();

        return console.log(outputBuilder, value, colors.RESET);
    }

    public log(value: string) {
        return this.base("INFO", value, colors.GREEN);
    }

    public warn(value: string) {
        return this.base("WARN", value, colors.YELLOW);
    }

    public error(value: string | Error) {
        return this.base("ERR", value instanceof Error ? value.message : value, colors.RED);
    }
}
