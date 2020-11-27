import { MessageEmbed } from "discord.js";
import { GuildMember } from "discord.js";
import { YokiColors } from "../../../common/YokiColors";
import { FormatDate } from "./FormatDate";

export default class LeaveEmbed extends MessageEmbed {
    public constructor(member: GuildMember) {
        super();
        super
            .setColor(YokiColors.ORANGE_RED)
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setDescription(
                `
                ❯ User: ${member.user} \`(${member.user.id})\`
                ❯ Join Date: \`${member.joinedAt ? FormatDate(member.joinedAt) : "unknown"}\`
                ❯ Leave Date: \`${FormatDate(new Date())}\`
                `
            )
            .setFooter("Left Server")
            .setTimestamp();
    }
}
