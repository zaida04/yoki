import { Listener } from "discord-akairo";
import { DMChannel } from "discord.js";
import { GuildChannel } from "discord.js";

export default class channelDelete extends Listener {
    public constructor() {
        super("channelDelete", {
            emitter: "client",
            event: "channelDelete",
        });
    }

    public exec(channel: DMChannel | GuildChannel) {
        if (channel instanceof DMChannel) return;
        this.client.Logger.log(
            `Channel ${channel.name} (${channel.id}) deleted in guild ${channel.guild.name} (${channel.guild.id})`,
        );
    }
}
