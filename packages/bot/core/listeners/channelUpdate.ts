import { Listener } from "discord-akairo";
import { DMChannel, GuildChannel } from "discord.js";

export default class channelUpdate extends Listener {
    public constructor() {
        super("channelUpdate", {
            emitter: "client",
            event: "channelUpdate",
        });
    }

    public exec(oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
        if (oldChannel instanceof DMChannel) return;
        this.client.Logger.log(
            `Channel ${oldChannel.name} (${oldChannel.id}) updated in guild ${oldChannel.guild.name} (${oldChannel.guild.id})`
        );
    }
}
