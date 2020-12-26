import { AkairoClient } from "discord-akairo";

import { Collection } from "discord.js";
import { DatabaseBannedWordEntry, filterAddOptions, filterDeleteOptions } from "./typings/word";

export default class FilterHandler {
    public guilds: Collection<string, Set<string>> = new Collection();
    public constructor(public client: AkairoClient) {}

    public async fetch(guild_id: string) {
        const words: DatabaseBannedWordEntry[] = await this.client.db
            .api<DatabaseBannedWordEntry>("messageFilter")
            .where("guild_id", guild_id);
        const existing = this.guilds.get(guild_id);
        if (existing) {
            this.guilds.set(guild_id, new Set([...existing, ...words.map((word) => word.content)]));
        } else {
            this.guilds.set(guild_id, new Set(words.map((word) => word.content)));
        }
        return this.guilds.get(guild_id)!;
    }

    public async delete(data: filterDeleteOptions) {
        await this.client.db
            .api("messageFilter")
            .where({
                guild_id: data.guild_id,
                content: data.content,
            })
            .del();
        const existing = await this.guilds.get(data.guild_id);
        existing?.delete(data.content);
        this.guilds.set(data.guild_id, existing!);
    }

    public async add(data: filterAddOptions) {
        await this.client.db.api<DatabaseBannedWordEntry>("messageFilter").insert({
            guild_id: data.guild_id,
            creator_id: data.creator_id,
            content: data.content,
        });
        const existing = await this.get(data.guild_id);
        return this.guilds.set(data.guild_id, new Set([...existing, data.content]));
    }

    public get(guild_id: string, force = false): Promise<Set<string>> {
        if (force) {
            return this.fetch(guild_id);
        }
        const existing = this.guilds.get(guild_id);
        return existing ? Promise.resolve(existing) : this.fetch(guild_id);
    }
}
