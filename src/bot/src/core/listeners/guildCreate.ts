import { Guild } from "discord.js";
import { Listener } from "discord-akairo";

export default class GuildCreateListener extends Listener {
    public constructor() {
        super("guildCreate", {
            emitter: "client",
            event: "guildCreate",
        });
    }

    public exec(guild: Guild) {
        this.client.Logger.log(`Joined Guild ${guild.name} (${guild.id})`);
    }
}
