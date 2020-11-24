import { MessageEmbed } from "discord.js";
import { YokiColors } from "../../common/YokiColors";
import { DatabaseSuggestionEntry } from "../typings/DatabaseSuggestionEntry";

export default class SuggestionEmbed extends MessageEmbed {
    public constructor(data: DatabaseSuggestionEntry) {
        super();
        switch (data.status) {
            case "OPEN": {
                super.setTitle("Currently Open").setColor(YokiColors.LIGHT_ORANGE);
                super.setDescription(`**Description:** ${data.description}`);
                break;
            }
            case "ACCEPTED": {
                super.setTitle("Accepted!").setColor(YokiColors.GREEN);
                if (data.comment)
                    super.setDescription(`
                **Description:** ${data.description}

                **Staff Comments:** ${data.comment}
                `);
                break;
            }
            case "REJECTED": {
                super.setTitle("Rejected!").setColor(YokiColors.ORANGE_RED);
                if (data.comment)
                    super.setDescription(`
                **Description:** ${data.description}

                **Staff Comments:** ${data.comment}
                `);
                break;
            }
        }
    }
}
