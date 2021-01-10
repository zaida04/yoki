import { User } from "discord.js";
import { Message } from "discord.js";
import { Guild } from "discord.js";
import { ActionType } from "../typings/Action";

export default class Action {
    public constructor(
        public readonly id: string,
        public guild: Guild,
        public target: User,
        public executor: User,
        public message: Message | null,
        public type: ActionType,
        public expiration_date: Date | null,
        public reason: string | null,
        public expired: boolean,
    ) {}
}
