import { TextChannel } from "discord.js";
import { Guild } from "discord.js";

export async function retrieveLogChannel(guild: Guild) {
    const logChannelID = await guild.settings.get<string>("logChannel");
    return logChannelID ? (guild.channels.cache.get(logChannelID) as TextChannel) : null;
}

export async function retrieveWelcomeChannel(guild: Guild) {
    const welcomeChannelID = await guild.settings.get<string>("welcomeChannel");
    return welcomeChannelID ? (guild.channels.cache.get(welcomeChannelID) as TextChannel) : null;
}
