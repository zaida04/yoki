import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class filterAutomod extends Command {
    public constructor() {
        super("filter-automod", {
            category: "messageFilter",
            module: "messageFilter",
            description: {
                content: "Enable the automod to scan messages",
                usage: "<word>",
                example: ["filter automod enable"],
            },
            args: [
                {
                    id: "word",
                    type: "lowercase",
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { word }: { word?: string }) {
        if (!(await message.guild?.settings.get("messageFilterEnabled")))
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Message filter is not enabled!",
                    "You can enable it by doing the `settings message-filter enable` command"
                )
            );
        if (!word || (word !== "enable" && word !== "disable"))
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed("You must pass either the word `enable` or `disable`")
            );

        const value = word === "enable" ? true : false;

        await message.guild!.settings.update("autoModEnabled", value);
        return message.channel.send(`Automod has been ${value ? "`enabled`" : "`disabled`"}!`);
    }
}
