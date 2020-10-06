import { Listener } from "discord-akairo";
import { User } from "discord.js";
import { Guild } from "discord.js";

export default class GuildBanAddListener extends Listener {
    public constructor() {
        super("guildBanAdd", {
            emitter: "client",
            event: "guildBanAdd",
        });
    }

    public exec(guild: Guild, user: User) {
        this.client.Logger.log(`User ${user.tag} (${user.id}) banned in guild ${guild.name} (${guild.id})`);
    }
}
