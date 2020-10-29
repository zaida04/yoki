import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";

import Action from "../../moderation/structures/Action";
import ActionEmbed from "../util/ActionEmbed";

import LeaveEmbed from "../util/LeaveEmbed";
import { retrieveLogChannel, retrieveWelcomeChannel } from "../util/retrieveChannel";

export default class guildMemberRemove extends Listener {
    public constructor() {
        super("logging-guildMemberRemove", {
            emitter: "client",
            event: "guildMemberRemove",
        });
    }

    public async exec(member: GuildMember) {
        const welcomeChannel = await retrieveWelcomeChannel(member.guild);
        if (welcomeChannel) {
            return welcomeChannel.send(new LeaveEmbed(member));
        }

        const logChannel = await retrieveLogChannel(member.guild);
        if (!logChannel) return;

        if (this.client.caseActions.cache.some((x: Action) => x.user.id === member.id && x.type === "kick")) {
            const cached = this.client.caseActions.cache.find(
                (x: Action) => x.user.id === member.id && x.type === "kick"
            );
            return logChannel.send(new ActionEmbed(cached!));
        }
    }
}
