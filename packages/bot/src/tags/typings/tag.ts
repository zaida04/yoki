import { User } from "discord.js";

export interface DatabaseTagEntry {
    guild_id: string;
    name: string;
    id: string;
    aliases: string[];
    creator_id: string;
    content: string;
    createdAt: Date;
}

export interface TagParams {
    name: string;
    creator: User;
    content: string;
}
