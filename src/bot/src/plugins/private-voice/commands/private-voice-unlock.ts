import { Command } from "discord-akairo";
import { VoiceChannel } from "discord.js";
import { Message } from "discord.js";
import { PrivateChannelDatabaseData } from "../typings/PrivateChannel";

export default class PrivateVoiceRename extends Command {
    public constructor() {
        super("private-voice-unlock", {
            category: "vc",
            module: "private-voice",
            description: {
                content: "Lock your personal voice channel",
                usage: "",
                example: ["vc unlock"],
            },
            args: [],
            channel: "guild",
            clientPermissions: "MANAGE_CHANNELS",
        });
    }

    public async exec(message: Message) {
        if (!(await message.guild!.settings.get("privateVoiceEnabled")))
            return message.channel.send("Private Voice Channels are not enabled on this server.");

        const persons_channel_entry = await this.client.db
            .api<PrivateChannelDatabaseData>("privateVoice")
            .where({
                guild_id: message.guild!.id,
                creator: message.author.id,
            })
            .first();

        if (!persons_channel_entry) return message.channel.send("You're not in a private voice channel!");
        const persons_channel = (await this.client.channels
            .fetch(persons_channel_entry.channel_id)
            .catch(() => null)) as VoiceChannel | null;
        if (!persons_channel)
            return message.channel.send("You're private voice channel could not be found... That's weird.");

        if (persons_channel.permissionsFor(message.guild!.roles.everyone)?.has("CONNECT"))
            return message.channel.send("Your channel is already unlocked!");

        if (
            !persons_channel.permissionsFor(message.client.user!.id)?.has("MANAGE_CHANNELS") ||
            !persons_channel.permissionsFor(message.client.user!.id)?.has("VIEW_CHANNEL")
        )
            return message.channel.send("I don't have permission to unlock that channel");

        void message.channel.send("Alright! unlocking rn...");
        this.client.inhibitedChannels.add(persons_channel.id);
        return persons_channel.createOverwrite(message.guild!.roles.everyone, {
            VIEW_CHANNEL: true,
            CONNECT: true,
            SPEAK: true,
        });
    }
}
