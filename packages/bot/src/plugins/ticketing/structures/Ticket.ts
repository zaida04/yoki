import { Guild } from "discord.js";
import { User } from "discord.js";

import { GuildMember } from "discord.js";
import { TextChannel } from "discord.js";

import TicketManager from "../TicketManager";

export default class Ticket {
    public opener: GuildMember | User;
    public reason: string | null;
    public guild: Guild | null;
    public channel: TextChannel | null;
    public closed: boolean;
    public id: string;

    public constructor(public manager: TicketManager, data: TicketParam) {
        this.id = data.id;
        this.opener = data.opener;
        this.reason = data.reason;
        this.guild = data.guild;
        this.channel = data.channel;
        this.closed = data.closed;
    }
}
export interface TicketParam {
    id: string;
    opener: GuildMember | User;
    reason: string | null;
    guild: Guild | null;
    channel: TextChannel | null;
    closed: boolean;
}
