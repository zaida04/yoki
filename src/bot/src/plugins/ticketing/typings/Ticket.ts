export interface TicketDatabaseEntry {
    id: string;
    opener_id: string;
    reason: string;
    guild_id: string;
    channel_id: string;
    closed: boolean;
    created_at: number;
    updated_at: number;
}
