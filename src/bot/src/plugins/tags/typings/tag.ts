import { User } from "discord.js";

export interface DatabaseTagEntry {
    guild_id: string;
    name: string;
    id: string;
    creator_id: string;
    content: string;
    created_at: number;
    updated_at: number;
}

export interface TagParams {
    name: string;
    creator: User;
    content: string;
}
