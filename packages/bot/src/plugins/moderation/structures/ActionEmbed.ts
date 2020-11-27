import { MessageEmbed } from "discord.js";
import { YokiColors } from "../../../common/YokiColors";
import Action from "./Action";

export default class ActionEmbed extends MessageEmbed {
    public constructor(action: Action) {
        super();
        super.setAuthor(`${action.executor.tag}`, action.executor.displayAvatarURL());
        super.setDescription(`
        **Target:** ${action.target} \`(${action.target.id})\`
        **Type:** \`${action.type}\`
        **Reason:** ${action.reason ? `\`${action.reason}\`` : "`not set`"}`);
        super.setThumbnail(action.target.displayAvatarURL());
        super.setFooter(`Case-ID #${action.id}`, action.guild.icon ? action.guild.iconURL()! : undefined);
        super.setTimestamp();

        switch (action.type) {
            case "ban": {
                super.setColor(YokiColors.RED);
                break;
            }
            case "kick": {
                super.setColor(YokiColors.LIGHT_ORANGE);
                break;
            }
            case "warn": {
                super.setColor(YokiColors.YELLOW);
                break;
            }
            case "unban": {
                super.setColor(YokiColors.GREEN);
                break;
            }
            case "softban": {
                super.setColor(YokiColors.YELLOW);
                break;
            }
            case "mute": {
                super.setColor(YokiColors.YELLOW);
                break;
            }
        }
    }
}
