import type { AkairoClient } from "discord-akairo";
import GamerNestModule from "../../common/GamerNestModule";

export default class Logging extends GamerNestModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "logging",
                name: "logging",
                listenerDirectory: `${__dirname}/listeners`,
            },
            client,
        );
        this.client.inhibitedChannels = new Set();
    }
}
