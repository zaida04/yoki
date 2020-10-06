import { Listener } from "discord-akairo";
import { GuildEmoji } from "discord.js";

export default class EmojiCreateListener extends Listener {
    public constructor() {
        super("emojiCreate", {
            emitter: "client",
            event: "emojiCreate",
        });
    }

    public exec(emoji: GuildEmoji) {}
}
