import { CategoryChannel } from "discord.js";
import { TextChannel } from "discord.js";

import { VoiceChannel } from "discord.js";
import { Guild } from "discord.js";
import { DatabaseManager, QueryBuilder } from "../../../../typings/Database";

export default class SettingsManager {
    public guild: Guild;
    public db: DatabaseManager;
    public constructor(guild: Guild, db: DatabaseManager) {
        this.guild = guild;
        this.db = db;
    }

    private baseGuildSettings<T>(): QueryBuilder {
        return this.db.api<T>("settings").where("guild_id", this.guild.id);
    }

    public get<T>(key: string | string[]): Promise<T | null> {
        return this.baseGuildSettings<T>()
            .select(key)
            .first()
            .then((x) => (x ? (x as T) : null));
    }

    public update(key: string, value: string | boolean | number) {
        return this.baseGuildSettings().update(key, value, ["guild_id", key]);
    }
    /* CONVENIENCE GETTERS BELOW */

    public channel<T extends TextChannel | VoiceChannel | CategoryChannel>(
        key: string,
        type: "text" | "voice" | "category"
    ): Promise<T | null> {
        return this.baseGuildSettings<string>()
            .select(key)
            .first()
            .then((x: string) => {
                return x
                    ? this.guild.channels.cache.filter((x) => x.type === type).has(x)
                        ? (this.guild.channels.cache.filter((x) => x.type === type).get(x) as T)
                        : null
                    : null;
            });
    }
}
