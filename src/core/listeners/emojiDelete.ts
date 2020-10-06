import { GuildEmoji } from "discord.js";
import { Listener } from "discord-akairo";

export default class EmojiDeleteListener extends Listener {
    public constructor() {
        super("emojiDelete", {
            emitter: "client",
            event: "emojiDelete",
        });
    }

    public exec(emoji: GuildEmoji) {}
}
