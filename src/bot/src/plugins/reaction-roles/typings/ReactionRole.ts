export interface DatabaseReactionRoleEntry {
    id: string;
    guild_id: string;
    message_id: string;
    role_id: string;
    reaction: string;
    custom: boolean;
    created_at: number;
    updated_at: number;
}
