import { AkairoClient } from "discord-akairo";
import { GuildMember, User } from "discord.js";
import { Guild } from "discord.js";
import { TextChannel } from "discord.js";
import BaseManager from "../common/BaseManager";
import Ticket from "./structures/Ticket";
import { TicketDatabaseEntry } from "./typings/Ticket";

export default class TicketManager extends BaseManager<Ticket> {
    public constructor(client: AkairoClient) {
        super(client);
    }

    public async create({
        opener,
        guild,
        channel,
        reason = null,
    }: {
        opener: string | GuildMember | User;
        guild: string | Guild;
        channel: string | TextChannel;
        reason: string | null;
    }): Promise<Ticket> {
        if (typeof channel === "string") channel = (await this.client.channels.fetch(channel)) as TextChannel;
        if (typeof guild === "string") guild = await this.client.guilds.fetch(guild);
        if (typeof opener === "string") opener = await guild.members.fetch(opener);

        const ticketData = {
            opener_id: opener instanceof GuildMember || opener instanceof User ? opener.id : opener,
            reason: reason ? reason : undefined,
            guild_id: guild.id,
            channel_id: channel.id,
            closed: false,
        };
        const createdTicket = await this.client.db.api<TicketDatabaseEntry>("tickets").insert(ticketData, ["id"]);

        return new Ticket(this, {
            channel: channel,
            closed: false,
            guild: guild,
            id: createdTicket[0].id,
            opener: opener,
            reason: reason ? reason : null,
        });
    }

    public async fetch({ id, channel_id }: { id?: string; channel_id?: string }): Promise<Ticket | null> {
        const ticket_database_entry = await this.client.db
            .api<TicketDatabaseEntry>("tickets")
            .where("channel_id", channel_id)
            .orWhere("id", id)
            .first();

        if (!ticket_database_entry) return null;
        const guild = await this.client.guilds.fetch(ticket_database_entry.guild_id).catch((_) => null);
        try {
            const ticket = new Ticket(this, {
                channel: (await this.client.channels
                    .fetch(ticket_database_entry.channel_id)
                    .catch((_) => null)) as TextChannel,
                closed: ticket_database_entry.closed,
                guild: guild,
                opener:
                    (await guild?.members.fetch(ticket_database_entry.opener_id)) ??
                    (await this.client.users.fetch(ticket_database_entry.opener_id)),
                reason: ticket_database_entry.reason,
                id: ticket_database_entry.id,
            });
            return ticket;
        } catch (e) {
            return null;
        }
    }
}
