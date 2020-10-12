import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Guild } from "discord.js";

export default class LogListener extends Listener {
    public constructor(id: string, event: string) {
        super(id, {
            emitter: "client",
            event: event,
        });
    }

    public async retrieveLogChannel(guild: Guild) {
        const logChannelID = await guild.settings.get<string>("logChannel");
        return logChannelID ? (guild.channels.cache.get(logChannelID) as TextChannel) : null;
    }
}
