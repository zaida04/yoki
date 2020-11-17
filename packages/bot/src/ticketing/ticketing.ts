import { AkairoClient } from "discord-akairo";
import YokiModule from "../common/YokiModule";

export default class Ticketing extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "ticketing",
                name: "ticketing",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client
        );
    }
}
