import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { inspect } from "util";

export default class Eval extends Command {
    public constructor() {
        super("eval", {
            aliases: ["eval"],
            ratelimit: 2,
            cooldown: 20000,
            args: [
                {
                    id: "code",
                    type: "string",
                    match: "rest",
                },
            ],
            channel: "guild",
            ownerOnly: true,
        });
    }

    public async exec(message: Message, { code }: { code: string }) {
        if (message.author.id !== "500765481788112916") return message.reply("no");
        try {
            // eslint-disable-next-line no-eval
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = inspect(evaled);
            return message.channel.send(this.clean(evaled).slice(0, 1850), {
                code: "xl",
            });
        } catch (e) {
            return message.reply(`Eval failed. ${e}`);
        }
    }

    private clean(text: string) {
        if (typeof text === "string")
            return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
        return text;
    }
}
