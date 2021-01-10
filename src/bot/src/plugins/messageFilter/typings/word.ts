export interface DatabaseBannedWordEntry {
    guild_id: string;
    content: string;
    creator_id: string;
    created_at: number;
    updated_at: number;
}

export interface filterAddOptions {
    guild_id: string;
    content: string;
    creator_id: string;
}

export interface filterDeleteOptions {
    guild_id: string;
    content: string;
}
