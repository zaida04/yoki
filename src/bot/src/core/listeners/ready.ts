import { Listener } from "discord-akairo";

export default class Ready extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
        });
    }

    public exec() {
        this.client.Logger.log(`Bot logged in as ${this.client.user!.tag}`);
        void this.client.user!.setPresence({
            activity: {
                name: "myself fly thru space",
                type: "WATCHING",
            },
            status: "online",
        });
    }
}
