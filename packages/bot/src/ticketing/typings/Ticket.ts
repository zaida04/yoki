export interface TicketDatabaseEntry {
    id: string;
    opener_id: string;
    reason: string;
    guild_id: string;
    channel_id: string;
    closed: boolean;
}
