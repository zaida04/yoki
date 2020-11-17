import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

export default class messageDelete extends Listener {
    public constructor() {
        super("logging-messageDelete", {
            emitter: "client",
            event: "messageDelete",
        });
    }

    public async exec(message: Message) {
        const logChannel = await message.guild?.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Message Deleted")
            .setDescription(
                `**Author:** ${message.author.tag}
                **Content:** ${message.content ? `\`\`\`${message.content}\`\`\`` : "`No detectable content`"}`
            )
            .setTimestamp();
        void logChannel.send(embed);
    }
}