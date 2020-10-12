import { AkairoClient } from "discord-akairo";

import YokiModule from "../common/YokiModule";
import ActionManager from "./ActionManager";

declare module "discord-akairo" {
    interface AkairoClient {
        caseActions: ActionManager;
    }
}

export default class Moderation extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "moderation",
                name: "moderation",
                commandDirectory: `${__dirname}/commands/`,
            },
            client
        );
        this.client.caseActions = new ActionManager(this.client);
    }
}
