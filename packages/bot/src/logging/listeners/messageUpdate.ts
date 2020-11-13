import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class messageUpdate extends Listener {
    public constructor() {
        super("logging-messageUpdate", {
            emitter: "client",
            event: "messageUpdate",
        });
    }

    public async exec(oldMessage: Message, newMessage: Message) {
        if (!oldMessage.guild) return;
        if (oldMessage.content === newMessage.content) return;

        const logChannel = await oldMessage.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        let diff = "";
        newMessage.content.split("").forEach((val, i) => {
            if (val !== oldMessage.content.charAt(i)) diff += val;
        });

        const embed = new MessageEmbed()
            .setTitle("Message Updated!")
            .setColor("GOLD")
            .setDescription(
                `
                **Old Message:** 
                \`\`\`${
                    oldMessage.content.length > 900 ? `${oldMessage.content.slice(0, 900)}...` : oldMessage.content
                } \`\`\`

                **New Message:** 
                \`\`\`${
                    newMessage.content.length > 900 ? `${newMessage.content.slice(0, 900)}...` : newMessage.content
                } \`\`\`
            `
            );

        void logChannel.send(embed);

        return diff;
    }
}
