import { User } from "discord.js";
import { Guild } from "discord.js";
import { ActionType } from "../../typings/Action";

export default class Action {
    public constructor(
        public readonly id: string,
        public guild: Guild,
        public user: User,
        public executor: User,
        public type: ActionType,
        public reason: string | null
    ) {}
}
