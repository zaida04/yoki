import { AkairoClient } from "discord-akairo";
import { DatabaseSuggestionEntry, SuggestionStatus } from "./typings/DatabaseSuggestionEntry";

export default class SuggestionHandler {
    public constructor(public client: AkairoClient) {}
    public fetch(guild_id: string, id: string): Promise<DatabaseSuggestionEntry | undefined> {
        return this.client.db
            .api<DatabaseSuggestionEntry>("suggestions")
            .where({
                guild_id: guild_id,
                id: id,
            })
            .first()
            .then((x) => x);
    }

    public create(data: {
        creator_id: string;
        guild_id: string;
        message_id: string | null;
        channel_id: string | null;
        description: string;
    }) {
        const sug: Partial<DatabaseSuggestionEntry> = {
            opener_id: data.creator_id,
            guild_id: data.guild_id,
            description: data.description,
            status: "OPEN",
        };

        return this.client.db
            .api("suggestions")
            .insert(sug, ["id"])
            .then((x) => {
                sug.id = x[0];
                return sug as Pick<DatabaseSuggestionEntry, "id" | "guild_id" | "description" | "status" | "opener_id">;
            });
    }

    public updateForMessage(data: { id: string; message_id: string; channel_id: string }) {
        return this.client.db.api<DatabaseSuggestionEntry>("suggestions").where("id", data.id).update({
            message_id: data.message_id,
            channel_id: data.channel_id,
        });
    }

    public status(guild_id: string, id: string, status: SuggestionStatus, comment?: string | null) {
        return this.client.db
            .api<DatabaseSuggestionEntry>("suggestions")
            .where({
                guild_id: guild_id,
                id: id,
            })
            .update({
                status: status,
                comment: comment,
            })
            .then((x) => x);
    }
}
