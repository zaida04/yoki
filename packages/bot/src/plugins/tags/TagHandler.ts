import { AkairoClient } from "discord-akairo";
import { DatabaseTagEntry, TagParams } from "./typings/tag";
import { Guild } from "discord.js";

export default class TagHandler {
    public constructor(public client: AkairoClient) {}
    public fetch(
        guild: Guild | string,
        { id, name }: { id?: string; name?: string }
    ): Promise<DatabaseTagEntry | null> {
        const guild_id = guild instanceof Guild ? guild.id : guild;
        const identifier: Record<string, string | number> = {};
        id ? (identifier.id = id) : name ? (identifier.name = name) : void 0;
        return this.client.db
            .api<DatabaseTagEntry>("tags")
            .where({ guild_id: guild_id, ...identifier })
            .first()
            .then((x?: DatabaseTagEntry) => (x ? x : null));
    }

    public delete(guild: Guild | string, id: string) {
        return this.client.db
            .api("tags")
            .where({
                guild_id: guild instanceof Guild ? guild.id : guild,
                id: id,
            })
            .del()
            .then(() => void 0);
    }

    public create(guild: Guild | string, data: TagParams): Promise<DatabaseTagEntry> {
        const tag: Partial<DatabaseTagEntry> = {
            guild_id: guild instanceof Guild ? guild.id : guild,
            name: data.name,
            creator_id: data.creator.id,
            content: data.content,
            createdAt: new Date().getTime(),
        };

        return this.client.db
            .api("tags")
            .insert(tag, ["id"])
            .then((x) => {
                tag.id = x[0];
                return tag as DatabaseTagEntry;
            });
    }
}
