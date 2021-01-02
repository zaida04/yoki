import { AkairoClient } from "discord-akairo";
import YokiModule from "../../common/YokiModule";
import FilterManager from "./FilterManager";

export default class MessageFilter extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "messageFilter",
                name: "messageFilter",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client,
        );
        client.messageFilter = new FilterManager(client);
    }
}
