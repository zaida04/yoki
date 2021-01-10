import Moderation from "../moderation";

declare module "discord-akairo" {
    interface AkairoClient {
        moderation: Moderation;
    }
}
