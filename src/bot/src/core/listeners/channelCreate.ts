import { Listener } from "discord-akairo";
import { DMChannel } from "discord.js";
import { GuildChannel } from "discord.js";

export default class channelCreate extends Listener {
    public constructor() {
        super("channelCreate", {
            emitter: "client",
            event: "channelCreate",
        });
    }

    public exec(channel: DMChannel | GuildChannel) {
        if (channel instanceof DMChannel) return;
        this.client.Logger.log(
            `Channel ${channel.name} (${channel.id}) created in guild ${channel.guild.name} (${channel.guild.id})`,
        );
    }
}
