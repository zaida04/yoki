import { Structures } from "discord.js";
import Client from "../../client/Client";
import SettingsManager from "../../managers/SettingsManager";

Structures.extend("Guild", (Guild) => {
    return class extends Guild {
        public settings: SettingsManager;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public constructor(client: Client, data: any) {
            super(client, data);
            this.settings = new SettingsManager(this, client.db);
        }
    };
});
