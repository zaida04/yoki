import { User } from "discord.js";
import { MessageEmbed } from "discord.js";
import { YokiColors } from "../../../common/YokiColors";
import { SuggestionStatus } from "../typings/DatabaseSuggestionEntry";

export default class SuggestionEmbed extends MessageEmbed {
    public constructor(data: {
        id: string;
        status: SuggestionStatus;
        description: string;
        comment?: string | null;
        opener: User | string;
    }) {
        super();
        super
            .setDescription(`Message: \`\`\`${data.description}\`\`\``)
            .setTimestamp()
            .setFooter(`ID: ${data.id} | Opened by ${data.opener instanceof User ? data.opener.tag : data.opener}`);

        switch (data.status) {
            case "OPEN": {
                super.setTitle("Open!").setColor(YokiColors.LIGHT_ORANGE);
                break;
            }
            case "ACCEPTED": {
                super.setTitle("Accepted!").setColor(YokiColors.GREEN);
                if (data.comment)
                    super.setDescription(
                        `
                    ${this.description}

                    **Staff Comments:** ${data.comment}
                    `
                    );
                break;
            }
            case "REJECTED": {
                super.setTitle("Rejected!").setColor(YokiColors.ORANGE_RED);
                if (data.comment)
                    super.setDescription(`
                ${this.description}
                **Staff Comments:** ${data.comment}
                \n
                `);
                break;
            }
        }
    }
}
