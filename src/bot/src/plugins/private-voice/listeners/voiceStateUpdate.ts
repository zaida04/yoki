import { Listener } from "discord-akairo";
import type { VoiceChannel } from "discord.js";
import type { VoiceState } from "discord.js";
import { TextChannel } from "discord.js";
import type { PrivateChannelDatabaseData } from "../typings/PrivateChannel";

interface PrivateVoiceChannelSettings {
    privateVoiceChannel: string | null;
    privateVoiceEnabled: boolean | null;
}

export default class PrivateChannelVoiceStateUpdate extends Listener {
    public constructor() {
        super("privatevoice-voicestateupdate", {
            emitter: "client",
            event: "voiceStateUpdate",
        });
    }

    public async exec(oldState: VoiceState, newState: VoiceState) {
        const privateVoiceSettings = await oldState.guild.settings.get<PrivateVoiceChannelSettings>([
            "privateVoiceChannel",
            "privateVoiceEnabled",
        ]);
        if (!privateVoiceSettings?.privateVoiceEnabled || !privateVoiceSettings.privateVoiceChannel) return;
        if (!oldState.channelID && newState.channelID) return this.handleJoins(newState, privateVoiceSettings);
        if (oldState.channelID && !newState.channelID) return this.handleLeaves(oldState, privateVoiceSettings);
    }

    private async handleJoins(newState: VoiceState, settings: PrivateVoiceChannelSettings) {
        if (newState.channelID !== settings.privateVoiceChannel) return;
        const privateVoiceChannelParent = (await this.client.channels
            .fetch(settings.privateVoiceChannel!)
            .catch(() => null)) as TextChannel | null;
        const channel = await newState.guild.channels.create(`${newState.member?.user.username}-VC`, {
            type: "voice",
            parent: privateVoiceChannelParent?.parentID ?? undefined,
        });
        return Promise.all([
            this.client.db.api<PrivateChannelDatabaseData>("privateVoice").insert({
                channel_id: channel.id,
                guild_id: channel.guild.id,
                creator: newState.member?.id,
            }),
            newState.member?.voice.setChannel(channel),
            newState.member
                ?.send(
                    `You now have a custom voice channel in ${newState.guild.name}! You can lock it by doing the \`vc lock\` command, and unlock it by doing \`vc unlock\`. You can also rename it to whatever you want by doing \`vc rename <new name>\``,
                )
                ?.catch(),
        ]);
    }

    private async handleLeaves(oldState: VoiceState, settings: PrivateVoiceChannelSettings) {
        const potentialPrivateChannel = await this.client.db
            .api<PrivateChannelDatabaseData>("privateVoice")
            .where({ channel_id: oldState.channelID!, guild_id: oldState.guild.id })
            .first();

        if (!potentialPrivateChannel) return;
        const private_channel = (await this.client.channels
            .fetch(potentialPrivateChannel.channel_id)
            .catch(() => null)) as VoiceChannel | null;
        if (!private_channel) return;
        if (private_channel.members.size) return;
        await this.client.db.api("privatevoice").where({ id: potentialPrivateChannel.id }).del();
        if (!private_channel.deletable) return;
        this.client.inhibitedChannels.add(private_channel.id);
        return private_channel.delete(`Automatic deletion of empty Private Voice Channel.`);
    }
}
