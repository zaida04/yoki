import { Listener } from "discord-akairo";
import { Collection } from "discord.js";

import { Message } from "discord.js";

export default class messageDeleteBulk extends Listener {
    public constructor() {
        super("reaction_roles-messageDeleteBulk", {
            emitter: "client",
            event: "messageDeleteBulk",
        });
    }

    public async exec(messages: Collection<string, Message>) {
        return this.client.db
            .api("reaction_roles")
            .whereIn(
                "message_id",
                messages.map((x) => x.id)
            )
            .del();
    }
}
