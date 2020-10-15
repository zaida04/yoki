import { MessageEmbed } from "discord.js";
import Action from "../../moderation/structures/Action";

export default class ActionEmbed extends MessageEmbed {
    public constructor(action: Action) {
        super();
        super.setAuthor(`${action.executor.tag}`, action.executor.displayAvatarURL());
        super.setDescription(`
        **Target:** \`${action.user.tag}\` (${action.user.id})
        **Type:** \`${action.type}\`
        **Reason:** ${action.reason}`);
        super.setThumbnail(action.user.displayAvatarURL());
        super.setFooter(
            `Case-ID ${action.id} • ${action.guild.name}`,
            action.guild.icon ? action.guild.iconURL()! : undefined
        );
        super.setTimestamp();

        switch (action.type) {
            case "ban": {
                super.setColor("RED");
                break;
            }
            case "kick": {
                super.setColor("ORANGE");
                break;
            }
            case "unban": {
                super.setColor("GREEN");
                break;
            }
            case "softban": {
                super.setColor("YELLOW");
                break;
            }
            case "mute": {
                super.setColor("YELLOW");
                break;
            }
        }
    }
}
