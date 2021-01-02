import { AkairoClient } from "discord-akairo";
import YokiModule from "../../common/YokiModule";
import ReactionRoleHandler from "./ReactionRoleHandler";

export default class ReactionRole extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "reaction-role",
                name: "reaction-role",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client,
        );
        this.client.rrHandler = new ReactionRoleHandler(client);
    }
}
