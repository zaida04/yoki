import { Guild } from "discord.js";
import { QueryBuilder } from "knex";
import DatabaseManager from "../../database/DatabaseManager";

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

    public async get<T extends string | Record<string, string | boolean | number>>(
        key: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformation?: (...params: any[]) => any
    ): Promise<T | null> {
        return key
            ? this.baseGuildSettings<T>()
                  .select(key)
                  .first()
                  .then((x: T) => (transformation ? transformation(x) : x))
            : null;
    }
}
