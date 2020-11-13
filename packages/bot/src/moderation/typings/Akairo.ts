import ActionManager from "../ActionManager";

declare module "discord-akairo" {
    interface AkairoClient {
        caseActions: ActionManager;
    }
}
