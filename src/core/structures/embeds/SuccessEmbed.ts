import { Message, MessageEmbed, EmbedFieldData } from "discord.js";

export default class SuccessEmbed extends MessageEmbed {
    public constructor(title: string | null, description: string | null, message: Message, fields?: EmbedFieldData[]) {
        super();
        super.setTitle(title);
        super.setDescription(description);
        if (fields && fields.length > 0) {
            super.addFields(fields);
        }
        super.setColor("GREEN");
        super.setFooter(message.client.user!.tag, message.client.user!.displayAvatarURL());
        super.setAuthor(message.author.tag, message.author.displayAvatarURL());
        super.setTimestamp();
    }
}
