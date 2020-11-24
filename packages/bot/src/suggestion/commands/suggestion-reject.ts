import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import SuggestionEmbed from "../util/SuggestionEmbed";

export default class suggestionReject extends Command {
    public constructor() {
        super("suggestion-reject", {
            category: "suggestion",
            module: "suggestion",
            description: {
                content: "Reject a suggestion",
                usage: "<id>",
                example: ["suggestion reject 234"],
            },
            args: [
                {
                    id: "id",
                    type: "string",
                },
                {
                    id: "comment",
                    match: "rest",
                    type: "string",
                },
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["EMBED_LINKS"],
            channel: "guild",
        });
    }

    public async exec(message: Message, { id, comment }: { id?: string; comment: string }) {
        if (!id) return message.channel.send(new this.client.Embeds.ErrorEmbed("Please provide a suggestion ID!"));
        const suggestion = await this.client.suggestionHandler.fetch(message.guild!.id, id);

        if (!suggestion)
            return message.channel.send(new this.client.Embeds.ErrorEmbed("Ticket with that ID doesn't exist!"));
        try {
            await this.client.suggestionHandler.status(message.guild!.id, id, "REJECTED");

            void (
                await (message.guild!.channels.cache.get(suggestion.channel_id) as TextChannel).messages.fetch(
                    suggestion.message_id
                )
            ).edit(new SuggestionEmbed(suggestion));

            return message.channel.send(
                new this.client.Embeds.SuccessEmbed(
                    "Suggestion Rejected!",
                    "Successfully rejected this suggestion!",
                    message
                )
            );
        } catch (e) {
            return message.channel.send("There was an error rejecting that suggestion");
        }
    }
}
