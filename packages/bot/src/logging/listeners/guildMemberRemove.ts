import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";

import LeaveEmbed from "../util/LeaveEmbed";

import Action from "../../moderation/structures/Action";
import { TextChannel } from "discord.js";

export default class guildMemberRemove extends Listener {
    public constructor() {
        super("logging-guildMemberRemove", {
            emitter: "client",
            event: "guildMemberRemove",
        });
    }

    public async exec(member: GuildMember) {
        if (this.client.caseActions.cache.some((x: Action) => x.target.id === member.id && x.type === "kick")) return;

        const welcomeChannel = await member.guild.settings.channel<TextChannel>("welcomeChannel", "text");
        if (welcomeChannel) {
            return welcomeChannel.send(new LeaveEmbed(member));
        }
    }
}
