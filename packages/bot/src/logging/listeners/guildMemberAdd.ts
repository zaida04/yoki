import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import JoinEmbed from "../util/JoinEmbed";
import { retrieveWelcomeChannel } from "../util/retrieveChannel";

export default class guildMemberAdd extends Listener {
    public constructor() {
        super("logging-guildMemberAdd", {
            emitter: "client",
            event: "guildMemberAdd",
        });
    }

    public async exec(member: GuildMember) {
        const welcomeChannel = await retrieveWelcomeChannel(member.guild);
        if (!welcomeChannel) return;
        return welcomeChannel.send(new JoinEmbed(member));
    }
}
