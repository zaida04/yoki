import { AkairoClient } from "discord-akairo";

import YokiModule from "../../common/YokiModule";
import ActionManager from "./ActionManager";
import ActionEmbed from "./structures/ActionEmbed";
import "./typings/Akairo";

export default class Moderation extends YokiModule {
    public ActionEmbed: typeof ActionEmbed = ActionEmbed;
    public caseActions: ActionManager;

    public constructor(client: AkairoClient) {
        super(
            {
                id: "moderation",
                name: "moderation",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client,
        );
        this.caseActions = new ActionManager(client);
        client.moderation = this;
    }
}
