import { AkairoClient } from "discord-akairo";
import YokiModule from "../../common/YokiModule";
import GiveawayManager from "./structures/GiveawayManager";

export default class Giveaway extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "giveaway",
                name: "giveaway",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client,
        );
        this.client.giveaways = new GiveawayManager(this.client);
    }
}
