import { Listener } from "discord-akairo";
import type { GuildMember, TextChannel } from "discord.js";
import LeaveEmbed from "../util/LeaveEmbed";
import type Action from "../../moderation/structures/Action";
import { handleMissingSend } from "../../../common/PermissionUtil";

export default class guildMemberRemove extends Listener {
    public constructor() {
        super("logging-guildMemberRemove", {
            emitter: "client",
            event: "guildMemberRemove",
        });
    }

    public async exec(member: GuildMember) {
        if (
            this.client.moderation.caseActions.cache.some((x: Action) => x.target.id === member.id && x.type === "kick")
        )
            return;

        const memberLogChannel = await member.guild.settings.channel<TextChannel>("memberlog", "text");
        if (memberLogChannel) {
            memberLogChannel
                .send(new LeaveEmbed(member))
                .catch((e) => handleMissingSend(e, memberLogChannel, member.guild));
        }

        const welcomeChannel = await member.guild.settings.channel<TextChannel>("welcomechannel", "text");
        if (welcomeChannel) {
            const leaveChannelMessage = await member.guild.settings.get<string>("leavemessage");
            welcomeChannel
                .send(leaveChannelMessage ? leaveChannelMessage : `${member.user} has left!`)
                .catch((e) => handleMissingSend(e, welcomeChannel, member.guild));
        }
    }
}
