import { MessageEmbed } from "discord.js";
import { GuildMember } from "discord.js";
import { YokiColors } from "../../common/YokiColors";
import { FormatDate, suspicious as sus } from "./FormatDate";

export default class JoinEmbed extends MessageEmbed {
    public constructor(member: GuildMember) {
        super();
        const suspicious = sus(member.user.createdAt);
        suspicious ? super.setColor("YELLOW") : super.setColor(YokiColors.GREEN);
        super
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setDescription(
                `
                ❯ ID: ${member.user} \`(${member.user.id})\` ${suspicious ? "⚠️" : ""}
                ❯ Account Creation Date: \`${FormatDate(member.user.createdAt)} ${suspicious ? "(recent)" : ""}\`
                ❯ Join Date: \`${member.joinedAt ? FormatDate(member.joinedAt) : "unknown"}\`
                `
            )
            .setFooter("Joined Server")
            .setTimestamp();
    }
}
