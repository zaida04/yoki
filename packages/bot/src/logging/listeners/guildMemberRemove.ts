import { Listener } from "discord-akairo";

import { GuildMember } from "discord.js";

import Action from "../../moderation/structures/Action";
import ActionEmbed from "../util/ActionEmbed";
import retrieveLogChannel from "../util/retrieveLogChannel";

export default class guildMemberRemove extends Listener {
    public constructor() {
        super("logging-guildMemberRemove", {
            emitter: "client",
            event: "guildMemberRemove",
        });
    }

    public async exec(member: GuildMember) {
        const logChannel = await retrieveLogChannel(member.guild);
        if (!logChannel) return;

        if (this.client.caseActions.cache.some((x: Action) => x.user.id === member.id && x.type === "kick")) {
            const cached = this.client.caseActions.cache.find(
                (x: Action) => x.user.id === member.id && x.type === "kick"
            );
            return logChannel.send(new ActionEmbed(cached!));
        }

        return void 0;
    }
}
