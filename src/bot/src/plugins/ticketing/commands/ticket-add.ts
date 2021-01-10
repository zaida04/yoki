import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import Ticket from "../structures/Ticket";

export default class ticketAdd extends Command {
    public constructor() {
        super("ticket-add", {
            category: "ticketing",
            module: "ticketing",
            description: {
                content: "Add a member to a Ticket",
                usage: "",
                example: ["ticket add @ocin#3727"],
            },
            args: [
                {
                    id: "person",
                    type: "member",
                    prompt: {
                        start: "What person would you like to add to the ticket?",
                    },
                },
                {
                    id: "channel",
                    type: "textChannel",
                    prompt: {
                        start: "Which channel that belongs do a ticket do you wish to add this person to?",
                    },
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { person, channel }: { person: GuildMember; channel?: TextChannel }) {
        let temp: Ticket | null | undefined;
        if (channel) {
            temp = await this.client.tickets.fetch({
                channel_id: channel.id,
            });
            if (!temp) return message.channel.send("That channel does not belong to a ticket");
        } else {
            temp = await this.client.tickets.fetch({
                channel_id: message.channel.id,
            });
            if (!temp) return message.channel.send("The channel you are in does not belong to a ticket");
        }

        void temp.channel?.createOverwrite(person, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
        });
        return message.channel.send("Added person to ticket!");
    }
}
