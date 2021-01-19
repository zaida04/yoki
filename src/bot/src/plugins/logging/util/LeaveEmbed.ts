import { stripIndents } from "common-tags";
import { MessageEmbed } from "discord.js";
import type { GuildMember } from "discord.js";
import { GamerNestColors } from "../../../common/GamerNestColors";
import { FormatDate } from "./FormatDate";

export default class LeaveEmbed extends MessageEmbed {
    public constructor(member: GuildMember) {
        super();
        super
            .setColor(GamerNestColors.ORANGE_RED)
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setDescription(
                stripIndents`
                ❯ User: ${member.user} \`(${member.user.id})\`
                ❯ Join Date: \`${member.joinedAt ? FormatDate(member.joinedAt) : "unknown"}\`
                ❯ Leave Date: \`${FormatDate(new Date())}\`
                `,
            )
            .setFooter("Left Server")
            .setTimestamp();
    }
}
