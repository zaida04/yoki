import { Listener } from "discord-akairo";
import type { GuildMember, TextChannel } from "discord.js";
import JoinEmbed from "../util/JoinEmbed";
import { handleMissingSend } from "../../../common/PermissionUtil";

export default class guildMemberAdd extends Listener {
    public constructor() {
        super("logging-guildMemberAdd", {
            emitter: "client",
            event: "guildMemberAdd",
        });
    }

    public async exec(member: GuildMember) {
        const memberLogChannel = await member.guild.settings.channel<TextChannel>("memberlog", "text");
        if (memberLogChannel) {
            memberLogChannel
                .send(new JoinEmbed(member))
                .catch((e) => handleMissingSend(e, memberLogChannel, member.guild));
        }

        const joinRoles = await member.guild.settings.get<string>("joinRoles");
        if (joinRoles) {
            const parsedjoinRoles = joinRoles.split(", ");
            void member.roles.add(parsedjoinRoles, "Auto role add");
        }

        const welcomeChannel = await member.guild.settings.channel<TextChannel>("welcomechannel", "text");
        if (welcomeChannel) {
            const welcomeChannelMessage = await member.guild.settings.get<string>("welcomemessage");
            welcomeChannel
                .send(
                    welcomeChannelMessage ? welcomeChannelMessage : `${member.user} has joined! Welcome to the server!`,
                )
                .catch((e) => handleMissingSend(e, welcomeChannel, member.guild));
        }
    }
}
