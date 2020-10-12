import { CategoryChannel } from "discord.js";
import { TextChannel } from "discord.js";

import { VoiceChannel } from "discord.js";
import { Guild } from "discord.js";
import { QueryBuilder } from "knex"
import DatabaseManager from "@yoki/database";

export default class SettingsManager {
    public guild: Guild;
    public db: DatabaseManager;
    public constructor(guild: Guild, db: DatabaseManager) {
        this.guild = guild;
        this.db = db;
    }

    private baseGuildSettings<T>(): QueryBuilder {
        return this.db.api<T>("settings").where("guild", this.guild.id);
    }

    public get<T>(key: string | string[]): Promise<T | null> {
        return this.baseGuildSettings<T>()
            .select(key)
            .first()
            .then((x: any[] | any) => (x ? (Array.isArray(key) ? { ...x } : x[key]) : null));
    }

    public async update(key: string, value: string | boolean | number) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const update: any = {};
        update[key] = value;
        return (await this.baseGuildSettings).length > 0
            ? this.baseGuildSettings().update(key, value)
            : this.baseGuildSettings().insert({
                  guild: this.guild.id,
                  left: false,
                  ...update,
              });
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
