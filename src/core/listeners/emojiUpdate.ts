import { GuildEmoji } from "discord.js";
import { Listener } from "discord-akairo";

export default class EmojiUpdateListener extends Listener {
    public constructor() {
        super("emojiUpdate", {
            emitter: "client",
            event: "emojiUpdate",
        });
    }

    public exec(oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {}
}
