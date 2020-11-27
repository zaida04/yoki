export interface DatabaseBannedWordEntry {
    guild_id: string;
    content: string;
    creator_id: string;
    createdAt: number;
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
