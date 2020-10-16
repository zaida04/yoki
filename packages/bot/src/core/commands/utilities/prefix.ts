import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class Prefix extends Command {
    public constructor() {
        super("prefix", {
            aliases: ["prefix", "p"],
            userPermissions: ["MANAGE_GUILD"],
            ratelimit: 2,
            description: {
                content: "Set a new prefix for this server",
                usage: "[new-prefix]",
                example: "prefix f!",
            },
            category: "util",
            cooldown: 600000,
            channel: "guild",
            args: [
                {
                    id: "newPrefix",
                    type: "string",
                },
            ],
        });
    }

    public async exec(message: Message, { newPrefix }: { newPrefix: string }) {
        if (!newPrefix)
            return message.channel.send(
                `The prefix for this guild is: \`${
                    (await message.guild!.settings.get<string>("prefix")) ?? this.client.config.defaultPrefix
                }\``
            );
        await message.guild!.settings.update("prefix", newPrefix);
        return message.channel.send(
            new this.client.Embeds.SuccessEmbed(
                "Prefix Successfully Changed",
                `Your prefix has now been changed to \`${newPrefix}\``,
                message
            )
        );
    }
}
