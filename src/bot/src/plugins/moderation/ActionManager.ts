import { AkairoClient } from "discord-akairo";

import { ActionData, ActionDatabaseData } from "./typings/Action";
import BaseManager from "../../common/BaseManager";
import Action from "./structures/Action";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";

export default class ActionManager extends BaseManager<Action> {
    public constructor(public client: AkairoClient) {
        super(client);
    }

    public async create(data: ActionData): Promise<Action> {
        const id = (
            await this.client.db
                .api("actions")
                .insert({
                    guild: data.guild.id,
                    target_id: data.target.id,
                    executor_id: data.executor.id,
                    reason: data.reason,
                    message_id: data.message ? data.message.id : null,
                    channel_id: data.message ? data.message.channel.id : null,
                    type: data.type,
                })
                .returning("id")
        )[0];

        const action = new Action(
            id as string,
            data.guild,
            data.target,
            data.executor,
            null,
            data.type,
            data.reason ? data.reason : null
        );
        this.cache.set(action.id, action);
        return action;
    }

    public updateMessage(action: Action, message: Message) {
        return this.client.db
            .api<ActionDatabaseData>("actions")
            .where({
                guild: action.guild.id,
                id: action.id,
            })
            .update({
                channel_id: message.channel.id,
                message_id: message.id,
            });
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
                          await this.client.users.fetch(x.target_id),
                          await this.client.users.fetch(x.executor_id),
                          x.channel_id && x.message_id
                              ? await ((await this.client.channels.fetch(x.channel_id)) as TextChannel).messages.fetch(
                                    x.message_id
                                )
                              : null,
                          x.type,
                          x.reason
                      )
                    : null
            );
    }
}
