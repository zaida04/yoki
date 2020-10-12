import { Guild } from "discord.js";
import { User } from "discord.js";

export type ActionType = "kick" | "ban" | "mute";
export interface ActionDatabaseData {
    guild: string;
    id: string;
    user: string;
    reason: string;
    type: ActionType;
}
export interface ActionData {
    guild: Guild;
    id: string;
    user: User;
    type: ActionType;
    reason: string;
}
