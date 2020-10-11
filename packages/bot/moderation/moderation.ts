import { AkairoClient } from "discord-akairo";
import YokiModule from "../YokiModule";

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
    }
}
