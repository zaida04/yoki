import { GuildMember } from "discord.js";
import { Listener } from "discord-akairo";

export default class GuildMemberAddListener extends Listener {
    public constructor() {
        super("guildMemberAdd", {
            emitter: "client",
            event: "guildMemberAdd",
        });
    }

    public exec(member: GuildMember) {
        this.client.Logger.log(
            `Member ${member.user.tag} (${member.id}) joined guild ${member.guild.name} (${member.guild.id})`
        );
        await guildMemberAdd(member);
    }
}
