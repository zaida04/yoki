import { User } from "discord.js";
import { Guild } from "discord.js";
import { Listener } from "discord-akairo";

export default class GuildBanRemoveListener extends Listener {
    public constructor() {
        super("guildBanRemove", {
            emitter: "client",
            event: "guildBanRemove",
        });
    }

    public exec(guild: Guild, user: User) {
        this.client.Logger.log(`User ${user.tag} (${user.id}) unbanned in guild ${guild.name} (${guild.id})`);
    }
}
