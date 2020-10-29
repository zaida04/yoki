import { MessageEmbed } from "discord.js";
import { GuildMember } from "discord.js";
import { FormatDate } from "./FormatDate";

export default class LeaveEmbed extends MessageEmbed {
    public constructor(member: GuildMember) {
        super();
        super
            .setColor("ff3300")
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
