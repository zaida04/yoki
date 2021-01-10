export interface GiveawayDatabaseData {
    guild_id: string;
    id: string;
    message_id: string;
    channel_id: string;
    title: string;
    description: string;
    emoji: string;
    creator: string;
    customEmoji: boolean;
    ended: boolean;
    winner_count: number;
    expiration_date: string;
    created_at: number;
    updated_at: number;
}
