import { AkairoClient } from "discord-akairo";

import YokiModule from "../../common/YokiModule";

export default class Logging extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "logging",
                name: "logging",
                listenerDirectory: `${__dirname}/listeners`,
            },
            client,
        );
    }
}
