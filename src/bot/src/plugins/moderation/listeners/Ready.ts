import { Listener } from "discord-akairo";

export default class ModerationReady extends Listener {
    public constructor() {
        super("moderation-ready", {
            emitter: "client",
            event: "ready",
        });
    }

    public exec() {
        this.client.moderation.caseActions.muteHandler.init();
    }
}
