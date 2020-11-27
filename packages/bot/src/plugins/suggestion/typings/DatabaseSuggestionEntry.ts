export interface DatabaseSuggestionEntry {
    id: string;
    guild_id: string;
    channel_id: string | null;
    message_id: string | null;
    opener_id: string;
    description: string;
    status: SuggestionStatus;
    comment: string | null;
}

export type SuggestionStatus = "ACCEPTED" | "REJECTED" | "OPEN";
