import { AkairoClient } from "discord-akairo";
import { DatabaseReactionRoleEntry } from "./typings/ReactionRole";

export default class ReactionRoleHandler {
    public constructor(public client: AkairoClient) {}

    public async preCheck(message_id: string) {
        return Boolean(await this.client.db.api("reaction_roles").where("message_id", message_id).first());
    }

    public fetch({ message_id, reaction, guild_id }: { message_id: string; reaction: string; guild_id: string }) {
        return this.client.db
            .api<DatabaseReactionRoleEntry>("reaction_roles")
            .where({
                message_id: message_id,
                reaction: reaction,
                guild_id: guild_id,
            })
            .first();
    }

    public create({
        message_id,
        reaction,
        guild_id,
        role_id,
    }: {
        message_id: string;
        reaction: string;
        guild_id: string;
        role_id: string;
    }) {
        return this.client.db.api("reaction_roles").insert(
            {
                message_id: message_id,
                reaction: reaction,
                guild_id: guild_id,
                role_id: role_id,
            },
            ["id"],
        );
    }
}
