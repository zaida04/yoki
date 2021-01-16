import { AkairoClient } from "discord-akairo";
import { Message } from "discord.js";
import { Collection } from "discord.js";
import { LevelDatabaseData } from "../typings/Level";
import Constant from "./Constant";

export default class LevelingHandler {
    public cooldowns = new Collection<string, number>();

    public constructor(public client: AkairoClient) {}
    public calculateLevelGainPerMessage(level: number) {
        return level * Constant.xpGainRatePerLevel;
    }

    public calculateLevelXPCap(level: number) {
        return level * Constant.xpLimitPerLevel;
    }

    public async onMessage(message: Message) {
        if (this.cooldowns.has(`${message.guild!.id}:${message.author.id}`)) {
            const cooldown = this.cooldowns.get(`${message.guild!.id}:${message.author.id}`);
            if (cooldown! > Date.now()) return;
            this.cooldowns.delete(message.author.id);
        }
        const user = await this.client.db
            .api<LevelDatabaseData>("leveling")
            .where({
                guild_id: message.guild!.id,
                user_id: message.author.id,
            })
            .first();

        if (!user) {
            return this.client.db.api("leveling").insert({
                user_id: message.author.id,
                guild_id: message.guild!.id,
                level: 1,
                xp: 0,
            });
        }

        this.cooldowns.set(`${message.guild!.id}:${message.author.id}`, Date.now() + Constant.xpCooldownInterval);
        const newXp = user.xp + this.calculateLevelGainPerMessage(user.level);
        if (newXp >= this.calculateLevelXPCap(user.level)) {
            const newLevel = user.level + 1;
            return this.client.db
                .api("leveling")
                .where({
                    guild_id: message.guild!.id,
                    user_id: message.author.id,
                })
                .update({
                    level: newLevel,
                    xp: 0,
                });
        }
        return this.client.db
            .api("leveling")
            .where({
                guild_id: message.guild!.id,
                user_id: message.author.id,
            })
            .update({
                xp: newXp,
            });
    }
}
