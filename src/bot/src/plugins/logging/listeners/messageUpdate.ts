import { stripIndents } from "common-tags";
import { Listener } from "discord-akairo";
import type { TextChannel, Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { handleMissingSend } from "../../../common/PermissionUtil";
import { YokiColors } from "../../../common/YokiColors";

export default class messageUpdate extends Listener {
    public constructor() {
        super("logging-messageUpdate", {
            emitter: "client",
            event: "messageUpdate",
        });
    }

    public async exec(oldMessage: Message, newMessage: Message) {
        if (!oldMessage.guild) return;
        if (oldMessage.author.id === oldMessage.client.user!.id) return;
        if (oldMessage.content === newMessage.content) return;

        const logChannel = await oldMessage.guild.settings.channel<TextChannel>("logchannel", "text");
        if (!logChannel) return;

        let diff = "";
        newMessage.content.split("").forEach((val, i) => {
            if (val !== oldMessage.content.charAt(i)) diff += val;
        });

        const embed = new MessageEmbed()
            .setTitle("Message Updated!")
            .setColor(YokiColors.LIGHT_ORANGE)
            .setDescription(
                stripIndents`
                **Old Message:** 
                \`\`\`${
                    oldMessage.content.length > 900 ? `${oldMessage.content.slice(0, 900)}...` : oldMessage.content
                } \`\`\`

                **New Message:** 
                \`\`\`${
                    newMessage.content.length > 900 ? `${newMessage.content.slice(0, 900)}...` : newMessage.content
                } \`\`\`
            `,
            )
            .setTimestamp();

        logChannel.send(embed).catch((e) => handleMissingSend(e, logChannel, oldMessage.guild!));

        return diff;
    }
}
