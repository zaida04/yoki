import { stripIndents } from "common-tags";
import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Message } from "discord.js";
import { LevelDatabaseData } from "../typings/Level";

export default class LevelingRank extends Command {
    public constructor() {
        super("leveling-rank", {
            aliases: ["rank", "level"],
            category: "leveling",
            module: "leveling",
            description: {
                content: "See your (or another persons) rank",
                usage: "[@user]",
                example: ["rank", "rank @ociN"],
            },
            args: [
                {
                    id: "target",
                    type: "member",
                },
            ],
            channel: "guild",
        });
    }

    public async exec(message: Message, { target }: { target?: GuildMember }) {
        const user = target ?? message.author;
        const result = await this.client.db
            .api<LevelDatabaseData>("leveling")
            .where({ guild_id: message.guild!.id, user_id: user.id })
            .first();

        if (!result) return message.channel.send("That person has no progress on this server.");

        const isAuthorTarget = user.id === message.author.id;
        return message.channel.send(
            stripIndents`${isAuthorTarget ? "Your" : `${message.author.tag}'s`} rank is Level \`${result.level}\` and ${
                isAuthorTarget ? "your" : "their"
            } current XP is \`${result.xp}/${this.client.leveling.calculateLevelXPCap(result.level)}\``,
        );
    }
}
