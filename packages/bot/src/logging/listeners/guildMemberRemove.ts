import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";

import LeaveEmbed from "../util/LeaveEmbed";
import { retrieveWelcomeChannel } from "../../common/retrieveChannel";
import Action from "../../moderation/structures/Action";

export default class guildMemberRemove extends Listener {
    public constructor() {
        super("logging-guildMemberRemove", {
            emitter: "client",
            event: "guildMemberRemove",
        });
    }

    public async exec(member: GuildMember) {
        if (this.client.caseActions.cache.some((x: Action) => x.user.id === member.id && x.type === "kick")) return;

        const welcomeChannel = await retrieveWelcomeChannel(member.guild);
        if (welcomeChannel) {
            return welcomeChannel.send(new LeaveEmbed(member));
        }
    }
}
