import { stripIndents } from "common-tags";
import { MessageEmbed } from "discord.js";
import type { GuildMember } from "discord.js";
import { GamerNestColors } from "../../../common/GamerNestColors";
import { FormatDate, suspicious as sus } from "./FormatDate";

export default class JoinEmbed extends MessageEmbed {
    public constructor(member: GuildMember) {
        super();
        const suspicious = sus(member.user.createdAt);
        suspicious ? super.setColor("YELLOW") : super.setColor(GamerNestColors.GREEN);
        super
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setDescription(
                stripIndents`
                ❯ ID: ${member.user} \`(${member.user.id})\` ${suspicious ? "⚠️" : ""}
                ❯ Account Creation Date: \`${FormatDate(member.user.createdAt)} ${suspicious ? "(recent)" : ""}\`
                ❯ Join Date: \`${member.joinedAt ? FormatDate(member.joinedAt) : "unknown"}\`
                `,
            )
            .setFooter("Joined Server")
            .setTimestamp();
    }
}
