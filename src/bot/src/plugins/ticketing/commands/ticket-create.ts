import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { TicketDatabaseEntry } from "../typings/Ticket";

export default class ticketCreate extends Command {
    public constructor() {
        super("ticket-create", {
            category: "ticketing",
            module: "ticketing",
            description: {
                content: "Create a Ticket",
                usage: "",
                example: ["ticket create"],
            },
            args: [
                {
                    id: "reason",
                    type: "string",
                    match: "rest",
                },
            ],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
            ratelimit: 50000,
        });
    }

    public async exec(message: Message, { reason }: { reason?: string }) {
        const ticket_category = await message.guild!.settings.get<string>("ticketCategory");
        if (!ticket_category)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Unable to create ticket",
                    "This server does not have ticketing enabled."
                )
            );

        if (
            await this.client.db
                .api<TicketDatabaseEntry>("tickets")
                .where({
                    guild_id: message.guild!.id,
                    opener_id: message.author.id,
                    closed: false,
                })
                .first()
        )
            return message.channel.send("You already have an open ticket in this server!");

        const channel = await message.guild!.channels.create(`${message.author.username}-ticket`, {
            type: "text",
            parent: ticket_category,
        });
        await channel.createOverwrite(message.author, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
        });
        const ticket = await this.client.tickets.create({
            opener: message.author.id,
            guild: message.guild!.id,
            channel: channel,
            reason: reason ? reason : null,
        });
        return message.reply(`created a ticket channel for you at: ${channel}.\nTicket ID: **${ticket.id}**`);
    }
}
