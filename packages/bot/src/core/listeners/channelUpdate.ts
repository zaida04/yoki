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
        if (oldChannel instanceof DMChannel || newChannel instanceof DMChannel) return;
        this.client.Logger.log(
            `Channel ${oldChannel.name} (${oldChannel.id}) updated ${
                oldChannel.name === newChannel.name ? "" : `name => ${newChannel.name} `
            }in guild ${oldChannel.guild.name} (${oldChannel.guild.id})`
        );
    }
}
