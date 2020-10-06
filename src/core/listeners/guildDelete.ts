import { Guild } from "discord.js";
import { Listener } from "discord-akairo";

export default class GuildDeleteListener extends Listener {
    public constructor() {
        super("guildDelete", {
            emitter: "client",
            event: "guildDelete",
        });
    }

    public exec(guild: Guild) {
        this.client.Logger.warn(`Left Guild ${guild.name} (${guild.id})`);
    }
}
