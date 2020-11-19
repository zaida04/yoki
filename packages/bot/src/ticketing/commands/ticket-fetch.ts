import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { TicketDatabaseEntry } from "../typings/Ticket";

export default class ticketFetch extends Command {
    public constructor() {
        super("ticket-fetch", {
            category: "ticketing",
            module: "ticketing",
            description: {
                content: "Fetch a Ticket by ID",
                usage: "<id>",
                example: ["ticket fetch 234"],
            },
            args: [
                {
                    id: "id",
                    type: "string",
                    prompt: {
                        start: "Please say the ID of a ticket to fetch before *(say it below)*",
                    },
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { id }: { id: string }) {
        const ticket = await this.client.db
            .api<TicketDatabaseEntry>("tickets")
            .where({
                guild_id: message.guild!.id,
                id: id,
            })
            .first();

        if (!ticket)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Ticket does not exist!",
                    "That ticket does not exist **in this server**"
                )
            );

        const user = await this.client.users.fetch(ticket.opener_id);

        return message.channel.send(
            new MessageEmbed().setTitle("Found Ticket!").setDescription(`
                **Opener:** \`${user.tag}\`
                **Reason:** \`${ticket.reason}\`
                **Closed?:** \`${ticket.closed ? "yes" : "no"}\`
                **Channel (if still exists):** <#${ticket.channel_id}>
            `)
        );
    }
}
