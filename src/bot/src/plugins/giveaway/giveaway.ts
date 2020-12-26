import { AkairoClient } from "discord-akairo";
import YokiModule from "../../common/YokiModule";

export default class Giveaway extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "giveaway",
                name: "giveaway",
                // commandDirectory: `${__dirname}/commands/`,
            },
            client
        );
    }
}
