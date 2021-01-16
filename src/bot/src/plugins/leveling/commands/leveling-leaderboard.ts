import { stripIndents } from "common-tags";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LevelDatabaseData } from "../typings/Level";

export default class LevelingLeaderboard extends Command {
    public constructor() {
        super("leveling-leaderboard", {
            aliases: ["leaderboard", "ranks", "levels"],
            category: "leveling",
            module: "leveling",
            description: {
                content: "See this servers leaderboard",
                usage: "",
                example: [],
            },
            args: [],
            channel: "guild",
        });
    }

    public async exec(message: Message) {
        const results = await this.client.db
            .api<LevelDatabaseData>("leveling")
            .where({ guild_id: message.guild!.id })
            .orderBy("level", "desc")
            .limit(10);
        if (!results.length) return message.channel.send("No one in this server has made any progress.");

        return message.channel.send(stripIndents` 
        \`\`\`
        Leaderboard for ${message.guild!.name}
        ======================================
        ${results
            .map((x) => {
                const user = this.client.users.cache.get(x.user_id);
                return `${user?.tag ?? x.id} - Level ${x.level}`;
            })
            .join("\n")}
        \`\`\``);
    }
}
