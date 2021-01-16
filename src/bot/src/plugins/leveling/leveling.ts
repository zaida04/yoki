import { AkairoClient } from "discord-akairo";
import YokiModule from "../../common/YokiModule";
import LevelingHandler from "./util/LevelingHandler";

export default class Leveling extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "leveling-system",
                name: "leveling",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client,
        );
        this.client.leveling = new LevelingHandler(this.client);
    }
}
