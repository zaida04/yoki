import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";

import LeaveEmbed from "../util/LeaveEmbed";

import Action from "../../moderation/structures/Action";
import { TextChannel } from "discord.js";
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

        const memberLogChannel = await member.guild.settings.channel<TextChannel>("memberLog", "text");
        if (memberLogChannel) {
            memberLogChannel
                .send(new LeaveEmbed(member))
                .catch((e) => handleMissingSend(e, memberLogChannel, member.guild));
        }

        const welcomeChannel = await member.guild.settings.channel<TextChannel>("welcomeChannel", "text");
        if (welcomeChannel) {
            const leaveChannelMessage = await member.guild.settings.get<string>("leaveMessage");
            welcomeChannel
                .send(leaveChannelMessage ? leaveChannelMessage : `${member.user} has left!`)
                .catch((e) => handleMissingSend(e, welcomeChannel, member.guild));
        }
    }
}
