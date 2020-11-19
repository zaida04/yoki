import { Listener } from "discord-akairo";
import { MessageReaction } from "discord.js";
import { User } from "discord.js";

export default class messageReactionAdd extends Listener {
    public constructor() {
        super("messageReactionAdd", {
            emitter: "client",
            event: "messageReactionAdd",
        });
    }

    public async exec(reaction: MessageReaction, user: User) {
        if (user.bot) return;
        if (!(await this.client.rrHandler.preCheck(reaction.message.id))) return;

        if (reaction.partial) await reaction.fetch();
        const rr = await this.client.rrHandler.fetch({
            message_id: reaction.message.id,
            reaction: reaction.emoji.id ?? reaction.emoji.name,
            guild_id: reaction.message.guild!.id,
        });
        if (!rr) return;
        void (await reaction.message.guild!.members.fetch(user)).roles.add(rr.role_id);
    }
}
