import { EmbedFieldData, MessageEmbed } from "discord.js";

export default class ErrorEmbed extends MessageEmbed {
    public constructor(title: string | null, description: string | null, fields?: EmbedFieldData[]) {
        super();
        if (title) super.setTitle(title);
        if (description) super.setDescription(description);
        if (fields && fields.length > 0) {
            super.addFields(fields);
        }
        super.setColor("RED");
    }
}
