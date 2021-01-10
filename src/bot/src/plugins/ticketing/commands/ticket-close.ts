import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import Ticket from "../structures/Ticket";

export default class ticketClose extends Command {
    public constructor() {
        super("ticket-close", {
            category: "ticketing",
            module: "ticketing",
            description: {
                content: "Close a Ticket",
                usage: "",
                example: ["ticket close", "ticket close #ticket-channel"],
            },
            args: [
                {
                    id: "channel",
                    type: (msg, str): TextChannel | string | null => {
                        if (!str) return null;
                        const channel = msg.guild?.channels.cache.filter((x) => x.type === "text").get(str);
                        return channel ? (channel as TextChannel) : str;
                    },
                    prompt: {
                        start:
                            "Please mention a channel that belongs to a ticket OR a ticket ID *(say your answers below)*",
                    },
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { ticket_lookup }: { ticket_lookup?: TextChannel | string | null }) {
        if (!ticket_lookup)
            return message.channel.send(
                "Please try executing the command again with either a valid channel or ticket ID",
            );
        let ticket: Ticket | null;
        if (ticket_lookup instanceof TextChannel)
            ticket = await this.client.tickets.fetch({
                channel_id: ticket_lookup.id,
            });
        else ticket = await this.client.tickets.fetch({ id: ticket_lookup });

        if (!ticket) return message.channel.send(new this.client.Embeds.ErrorEmbed("Ticket does not exist!"));
        await this.client.tickets.close(ticket);
        return ticket.channel?.id === message.channel.id
            ? message.channel.send("Ticket has been closed")
            : void ticket.channel?.send(
                  `**This ticket has been closed and archived. To reopen it, please do \`ticket open ${ticket.id}\``,
              );
    }
}
