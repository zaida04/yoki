import { Listener } from "discord-akairo";
import type PrivateVoice from "../private-voice";

export default class PrivateVoiceReady extends Listener {
    public constructor() {
        super("privatevoice-ready", {
            emitter: "client",
            event: "ready",
        });
    }

    public exec() {
        return (this.client.Modules.get("private-voice") as PrivateVoice).sweeper.init();
    }
}
