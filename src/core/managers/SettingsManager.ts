import { Guild } from "discord.js";
import DatabaseManager from "../../database/DatabaseManager";

export default class SettingsManager {
    public guild: Guild;
    public db: DatabaseManager;
    public constructor(guild: Guild, db: DatabaseManager) {
        this.guild = guild;
        this.db = db;
    }

    private get baseGuildSettings() {
        return this.db.api("settings").where("guild_id", this.guild.id);
    }

    public async get(key: string): Promise<string | null> {
        return key
            ? this.baseGuildSettings
                  .select(key)
                  .first()
                  .then((x) => x?.[key] || null)
            : null;
    }
}
