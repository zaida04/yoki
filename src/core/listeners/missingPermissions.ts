import { Command } from "discord-akairo";
import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class missingPermissions extends Listener {
    public constructor() {
        super("missingPermissions", {
            emitter: "commandHandler",
            event: "missingPermissions",
        });
    }

    public exec(message: Message, command: Command, type: "client" | "user", missing: any[]) {
        if (!message.guild) return;
        this.client.Logger.error(
            `${
                type === "user" ? `User ${message.author.tag} (${message.author.id})` : "Client"
            } is missing permissions "${missing.join(", ")}" when executing command "${command.id}" in guild "${
                message.guild.name
            }" (${message.guild.id})`
        );
        return type === "user"
            ? this.userMissingPermissions(message, missing)
            : this.clientMissingPermissions(message, missing);
    }

    private async userMissingPermissions(message: Message, missing: any[]) {
        return message.channel.send(
            new MessageEmbed()
                .setTitle("You are missing permissions!")
                .setColor("RED")
                .setDescription(
                    `You are missing the following permissions: ${missing.map((x: string) => `\`${x}\``).join(", ")}`
                )
        );
    }

    private async clientMissingPermissions(message: Message, missing: any[]) {
        const channel = (await message.guild!.settings.logChannel) || message.channel;
        return channel.send(
            new MessageEmbed()
                .setTitle("I am missing permissions!")
                .setColor("RED")
                .setDescription(
                    `I am missing the following permissions: ${missing.map((x: string) => `\`${x}\``).join(", ")}`
                )
        );
    }
}
