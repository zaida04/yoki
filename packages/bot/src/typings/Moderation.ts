import ActionManager from "../moderation/ActionManager";

declare module "discord-akairo" {
    interface AkairoClient {
        caseActions: ActionManager;
    }
}
