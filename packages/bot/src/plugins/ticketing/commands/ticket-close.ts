import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";

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
                    type: "textChannel",
                    prompt: {
                        optional: true,
                        start: "Please mention a channel that belongs to a ticket *(say it below)*",
                    },
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { channel }: { channel?: TextChannel }) {
        channel = channel ?? (message.channel as TextChannel);

        const ticket = await this.client.tickets.fetch({
            channel_id: channel.id,
        });

        if (!ticket) return message.channel.send(new this.client.Embeds.ErrorEmbed("Ticket does not exist!"));
        await this.client.tickets.close(ticket);
        return channel.id === message.channel.id
            ? message.channel.send("Ticket has been closed")
            : void ticket.channel?.send(
                  `**This ticket has been closed and archived. To reopen it, please do the **\`ticket open ${ticket.id}\``
              );
    }
}
