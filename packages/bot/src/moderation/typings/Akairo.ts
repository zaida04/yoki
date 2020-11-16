import ActionManager from "../ActionManager";
import Moderation from "../moderation";

declare module "discord-akairo" {
    interface AkairoClient {
        caseActions: ActionManager;
        moderation: Moderation;
    }
}
