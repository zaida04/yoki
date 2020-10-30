import { AkairoClient } from "discord-akairo";

import { ActionData, ActionDatabaseData } from "../typings/Action";
import BaseManager from "../common/BaseManager";
import Action from "./structures/Action";

export default class ActionManager extends BaseManager<Action, ActionData> {
    public constructor(public client: AkairoClient) {
        super(client);
    }

    public async create(data: ActionData): Promise<Action> {
        const id = (
            await this.client.db
                .api("actions")
                .insert({
                    guild: data.guild.id,
                    user: data.user.id,
                    executor: data.executor.id,
                    reason: data.reason,
                    type: data.type,
                })
                .returning("id")
        )[0];

        const action = new Action(
            id as string,
            data.guild,
            data.user,
            data.executor,
            data.type,
            data.reason ? data.reason : null
        );
        this.cache.set(action.id, action);
        return action;
    }

    public delete(guild_id: string, action_id: string): Promise<boolean> {
        this.client.caseActions.cache.delete(action_id);
        return this.client.db
            .api<ActionDatabaseData>("actions")
            .where({
                guild: guild_id,
                id: action_id,
            })
            .delete()
            .then((x: number) => Boolean(x));
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
                          await this.client.users.fetch(x.executor),
                          x.type,
                          x.reason
                      )
                    : null
            );
    }
}
