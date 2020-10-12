import { AkairoClient } from "discord-akairo";

import { ActionData, ActionDatabaseData } from "../../typings/Action";
import BaseManager from "../common/BaseManager";
import Action from "./structures/Action";

export default class ActionManager extends BaseManager<Action, ActionData> {
    public constructor(client: AkairoClient) {
        super(client);
    }

    public async create(data: ActionData): Promise<Action> {
        const entry: ActionDatabaseData = await this.client.db.api("actions").insert({
            guild: data.guild.id,
            user: data.user.id,
            reason: data.reason,
            type: data.type,
        });

        const action = new Action(entry.id, data.guild, data.user, entry.type, data.reason);
        this.cache.set(action.id, action);
        return action;
    }

    public delete(guild_id: string, action_id: string): Promise<boolean> {
        return this.client.db
            .api<ActionDatabaseData>("actions")
            .where({
                guild: guild_id,
                id: action_id,
            })
            .delete()
            .then((x) => Boolean(x));
    }

    public fetch(guild_id: string, action_id: string): Promise<Action | null> {
        return this.client.db
            .api<ActionDatabaseData>("actions")
            .where({
                guild: guild_id,
                id: action_id,
            })
            .first()
            .then(async (x?: ActionDatabaseData) =>
                x
                    ? new Action(
                          x.id,
                          await this.client.guilds.fetch(x.guild),
                          await this.client.users.fetch(x.user),
                          x.type,
                          x.reason
                      )
                    : null
            );
    }
}
