import { Guild } from "discord.js";
import { User } from "discord.js";

export type ActionType = "kick" | "ban" | "mute" | "softban" | "unban" | "warn";
export interface ActionDatabaseData {
    guild: string;
    id: string;
    user: string;
    reason: string | null;
    type: ActionType;
    executor: string;
}
export interface ActionData {
    guild: Guild;
    user: User;
    type: ActionType;
    reason?: string;
    executor: User;
}
