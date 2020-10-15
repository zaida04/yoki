import { AkairoClient } from "discord-akairo";

import YokiModule from "../common/YokiModule";
import ActionManager from "./ActionManager";

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
        client.caseActions = new ActionManager(client);
    }
}
