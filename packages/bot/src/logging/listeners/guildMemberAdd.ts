import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import JoinEmbed from "../util/JoinEmbed";

import { TextChannel } from "discord.js";

export default class guildMemberAdd extends Listener {
    public constructor() {
        super("logging-guildMemberAdd", {
            emitter: "client",
            event: "guildMemberAdd",
        });
    }

    public async exec(member: GuildMember) {
        const welcomeChannel = await member.guild.settings.channel<TextChannel>("welcomeChannel", "text");
        if (!welcomeChannel) return;
        return welcomeChannel.send(new JoinEmbed(member));
    }
}
