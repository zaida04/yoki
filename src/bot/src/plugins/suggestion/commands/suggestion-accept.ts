import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import SuggestionEmbed from "../util/SuggestionEmbed";

export default class suggestionAccept extends Command {
    public constructor() {
        super("suggestion-accept", {
            category: "suggestions",
            module: "suggestions",
            description: {
                content: "Accept a suggestion",
                usage: "<id>",
                example: ["suggestion accept 234"],
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

    public async exec(message: Message, { id, comment }: { id?: string; comment?: string }) {
        if (!id) return message.channel.send(new this.client.Embeds.ErrorEmbed("Please provide a suggestion ID!"));
        const suggestion = await this.client.suggestionHandler.fetch(message.guild!.id, id);
        if (!suggestion)
            return message.channel.send(new this.client.Embeds.ErrorEmbed("Ticket with that ID doesn't exist!"));
        if (suggestion.status === "ACCEPTED") return message.channel.send("This has already been accepted!");

        try {
            await this.client.suggestionHandler.status(message.guild!.id, id, "ACCEPTED", comment);
            suggestion.comment = comment ?? null;
            suggestion.status = "ACCEPTED";
            const opener = await this.client.users.fetch(suggestion.opener_id).catch(() => suggestion.opener_id);

            void (
                await (message.guild!.channels.cache.get(suggestion.channel_id!) as TextChannel).messages.fetch(
                    suggestion.message_id!,
                )
            ).edit(new SuggestionEmbed({ opener, ...suggestion }));

            return message.channel.send(
                new this.client.Embeds.SuccessEmbed(
                    "Suggestion Accepted!",
                    "Successfully accepted this suggestion!",
                    message,
                ),
            );
        } catch (e) {
            return message.channel.send("There was an error accepting that suggestion");
        }
    }
}
