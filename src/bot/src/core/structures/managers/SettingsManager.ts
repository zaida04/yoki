import { CategoryChannel } from "discord.js";
import { TextChannel } from "discord.js";

import { VoiceChannel } from "discord.js";
import { Guild } from "discord.js";
import { QueryBuilder } from "knex";
import DatabaseManager from "./DatabaseManager";

export default class SettingsManager {
    public guild: Guild;
    public db: DatabaseManager;
    public constructor(guild: Guild, db: DatabaseManager) {
        this.guild = guild;
        this.db = db;
    }

    public baseGuildSettings<T>(): QueryBuilder {
        return this.db.api<T>("settings").where("guild", this.guild.id);
    }

    public get<T>(key: string | string[]): Promise<T | null> {
        return (
            this.baseGuildSettings()
                .select(Array.isArray(key) ? key.join(", ") : key)
                .first()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((x: Record<string, any> | undefined) => {
                    if (!x) return null;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let returnValue: any;

                    if (Array.isArray(key)) {
                        returnValue = {};
                        for (const k of key) {
                            returnValue[k] = x[k];
                        }
                    } else {
                        returnValue = x[key];
                    }

                    return returnValue as T;
                    /* (x ? (Array.isArray(key) ? ({ ...x } as T) : (x[key] as T)) : null)*/
                })
        );
    }

    public async update(key: string, value: string | boolean | number | null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const update: any = {};
        update[key] = value;
        return (await this.baseGuildSettings().first())
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
            .then((x: Record<string, string> | undefined) => {
                return x && key in x
                    ? this.guild.channels.cache.filter((x) => x.type === type).has(x[key])
                        ? (this.guild.channels.cache.filter((x) => x.type === type).get(x[key]) as T)
                        : null
                    : null;
            });
    }
}
