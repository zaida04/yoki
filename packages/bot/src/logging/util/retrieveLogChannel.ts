import { TextChannel } from "discord.js";
import { Guild } from "discord.js";

export default async function retrieveLogChannel(guild: Guild) {
    const logChannelID = await guild.settings.get<string>("logChannel");
    return logChannelID ? (guild.channels.cache.get(logChannelID) as TextChannel) : null;
}
