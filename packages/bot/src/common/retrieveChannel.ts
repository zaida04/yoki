import { TextChannel } from "discord.js";
import { Guild } from "discord.js";

export async function retrieveLogChannel(guild: Guild) {
    const logChannelID = await base("logChannel", guild);
    return logChannelID ? (guild.channels.cache.get(logChannelID) as TextChannel) : null;
}

function base(name: string, guild: Guild) {
    return guild.settings.get<string>(name);
}

export async function retrieveModLogChannel(guild: Guild) {
    const mogLogChannel = await base("modLogChannel", guild);
    return mogLogChannel ? (guild.channels.cache.get(mogLogChannel) as TextChannel) : null;
}

export async function retrieveWelcomeChannel(guild: Guild) {
    const welcomeChannelID = await base("welcomeChannel", guild);
    return welcomeChannelID ? (guild.channels.cache.get(welcomeChannelID) as TextChannel) : null;
}
