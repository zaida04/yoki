import { Message } from "discord.js";
import { Guild } from "discord.js";
import { User } from "discord.js";

export type ActionType = "kick" | "ban" | "mute" | "softban" | "unban" | "warn";
export interface ActionDatabaseData {
    guild: string;
    id: string;
    target_id: string;
    reason: string | null;
    type: ActionType;
    executor_id: string;
    message_id: string | null;
    expiration_date: string | null;
    channel_id: string | null;
    createdAt: Date;
}
export interface ActionData {
    guild: Guild;
    target: User;
    type: ActionType;
    reason?: string;
    expiration_date: Date | null;
    executor: User;
    message: Message | null;
}
