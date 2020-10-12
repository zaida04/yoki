import { MessageEmbed } from "discord.js";
import Action from "../../moderation/structures/Action";

export default class ActionEmbed extends MessageEmbed {
    public constructor(action: Action) {
        super();
        super.setAuthor(`${action.executor.username} (${action.executor.id})`, action.executor.displayAvatarURL());
        super.setDescription(`
        **Target:** \`${action.user.tag}\` (${action.user.id})\n
        **Type:** \`${action.type}\`\n
        **Reason:** ${action.reason}`);
        super.setThumbnail(action.user.displayAvatarURL());
        super.setFooter(
            `case ${action.id} • ${action.guild.name} (${action.guild.id})`,
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
            case "mute": {
                super.setColor("YELLOW");
                break;
            }
        }
    }
}
