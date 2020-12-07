import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ticketOpen extends Command {
    public constructor() {
        super("ticket-reopen", {
            category: "ticketing",
            module: "ticketing",
            description: {
                content: "Reopen a Ticket by ID",
                usage: "<id>",
                example: ["ticket open 234"],
            },
            args: [
                {
                    id: "id",
                    type: "string",
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { id }: { id?: string }) {
        if (!id) return message.channel.send(new this.client.Embeds.ErrorEmbed("Please provide a ticket ID!"));

        const ticket = await this.client.tickets.fetch({
            id: id,
        });
        if (!ticket) return message.channel.send(new this.client.Embeds.ErrorEmbed("That ticket does not exist!"));
        if (!ticket.closed) return message.channel.send("Ticket is not closed!");
        await this.client.tickets.open(ticket);
        return message.channel.id === ticket.channel?.id
            ? ticket.channel.send("Ticket has been reopened")
            : message.channel.send(`Ticket has been re-opened. ${ticket.channel}`);
    }
}
