import type { AkairoClient } from "discord-akairo";
import { Collection } from "discord.js";
import type { VoiceChannel } from "discord.js";
import CronJob from "node-cron";
import type { PrivateChannelDatabaseData } from "../typings/PrivateChannel";

export default class ChannelSweeper {
    public timeouts = new Collection<string, NodeJS.Timer>();
    public constructor(public client: AkairoClient, public checkRate: number) {}

    public async sweep(channel: PrivateChannelDatabaseData) {
        const private_channel = (await this.client.channels
            .fetch(channel.channel_id)
            .catch(() => null)) as VoiceChannel | null;
        if (!private_channel) return;
        if (private_channel.members.size) return;
        await this.client.db.api("privatevoice").where({ id: channel.id }).del();
        if (private_channel.deletable)
            void private_channel.delete(`Automatic deletion of Private Voice Channels after 24 hours.`);
    }

    public async sweeper() {
        const expired_channels = await this.client.db
            .api<PrivateChannelDatabaseData>("privateVoice")
            .where("created_at", "<", new Date(Date.now() + 8.64e7));

        this.client.Logger.log(
            `Sweeping private voice channels, ${expired_channels.length} channel(s) found expired. ${
                expired_channels.length > 0 ? `IDS: ${expired_channels.map((x) => x.id).join(", ")}` : ""
            }`,
        );

        let i = 0;
        for (const channel of expired_channels) {
            this.timeouts.set(
                channel.id,
                this.client.setTimeout(
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    () => this.sweep(channel),
                    30000 * i,
                ),
            );
            i++;
        }
    }

    public async init() {
        await this.sweeper();
        CronJob.schedule("0 0 0 * * *", async () => {
            await this.sweeper();
        });
    }
}
