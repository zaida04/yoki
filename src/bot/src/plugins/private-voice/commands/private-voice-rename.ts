import { Command } from "discord-akairo";
import { VoiceChannel } from "discord.js";
import { Message } from "discord.js";
import { PrivateChannelDatabaseData } from "../typings/PrivateChannel";

export default class PrivateVoiceRename extends Command {
    public constructor() {
        super("private-voice-rename", {
            category: "vc",
            module: "private-voice",
            description: {
                content: "Rename your personal voice channel",
                usage: "<newname>",
                example: ["vc rename testtest"],
            },
            args: [
                {
                    id: "newname",
                    type: "string",
                },
            ],
            channel: "guild",
        });
    }

    public async exec(message: Message, { newname }: { newname?: string }) {
        if (!newname) return message.channel.send("You need to give a new name for your voice channel.");
        if (newname.length > 20) return message.channel.send("That's too long of a name.");
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

        void message.channel.send("Alright! Renaming rn...");
        this.client.inhibitedChannels.add(persons_channel.id);
        return persons_channel.setName(newname);
    }
}
