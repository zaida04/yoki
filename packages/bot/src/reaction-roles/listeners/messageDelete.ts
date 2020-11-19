import { Listener } from "discord-akairo";

import { Message } from "discord.js";

export default class messageDelete extends Listener {
    public constructor() {
        super("reaction_roles-messageDelete", {
            emitter: "client",
            event: "messageDelete",
        });
    }

    public async exec(message: Message) {
        return this.client.db.api("reaction_roles").where("message_id", message.id).del();
    }
}
