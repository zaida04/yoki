import { AkairoClient } from "discord-akairo";

import YokiModule from "../common/YokiModule";

export default class Moderation extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "moderation",
                name: "moderation",
                listenerDirectory: `${__dirname}/listeners`,
            },
            client
        );
    }
}
