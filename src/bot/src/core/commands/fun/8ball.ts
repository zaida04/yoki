import { Command } from "discord-akairo";
import { Message } from "discord.js";

const responses = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful",
];

export default class EightBall extends Command {
    public constructor() {
        super("8ball", {
            aliases: ["8ball", "8b"],
            description: {
                content: "Let the bot decide your future",
                usage: "",
                examples: ["8ball will i get a gf"],
            },
        });
    }

    public exec(message: Message) {
        return message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
    }
}
