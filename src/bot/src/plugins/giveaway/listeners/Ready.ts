import { Listener } from "discord-akairo";

export default class GiveawayReady extends Listener {
    public constructor() {
        super("giveaway-ready", {
            emitter: "client",
            event: "ready",
        });
    }

    public exec() {
        this.client.giveaways.scheduler.init();
    }
}
