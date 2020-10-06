import { GuildMember } from "discord.js";
import { Listener } from "discord-akairo";

export default class GuildMemberRemoveListener extends Listener {
    public constructor() {
        super("guildMemberRemove", {
            emitter: "client",
            event: "guildMemberRemove",
        });
    }

    public exec(member: GuildMember) {
        this.client.Logger.log(
            `Member ${member.user.tag} (${member.id}) left guild ${member.guild.name} (${member.guild.id})`
        );
    }
}
