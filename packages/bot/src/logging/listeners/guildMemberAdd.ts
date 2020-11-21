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
        const memberLogChannel = await member.guild.settings.channel<TextChannel>("memberLog", "text");
        if (memberLogChannel) {
            void memberLogChannel.send(new JoinEmbed(member));
        }

        const joinRoles = await member.guild.settings.get<string>("joinRoles");
        if (joinRoles) {
            const parsedjoinRoles = joinRoles.split(", ");
            member.roles.add(parsedjoinRoles, "Auto role add");
        }

        const welcomeChannel = await member.guild.settings.channel<TextChannel>("welcomeChannel", "text");
        if (welcomeChannel) {
            const welcomeChannelMessage = await member.guild.settings.get<string>("welcomeMessage");
            void welcomeChannel.send(
                welcomeChannelMessage ? welcomeChannelMessage : `${member.user} has joined! Welcome to the server!`
            );
        }
    }
}
