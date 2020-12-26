import { Structures } from "discord.js";
import Client from "../../client/Client";
import SettingsManager from "../managers/SettingsManager";

Structures.extend("Guild", (Guild) => {
    return class extends Guild {
        public settings: SettingsManager;
        public messageFilter?: boolean = undefined;
        public _prefix?: string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public constructor(client: Client, data: any) {
            super(client, data);
            this.settings = new SettingsManager(this, client.db);
        }

        public async prefix(force = false) {
            if (this._prefix === undefined) {
                this._prefix =
                    (await this.settings.get<string>("prefix")) ?? (this.client as Client).config.defaultPrefix;
            } else if (force) {
                this._prefix =
                    (await this.settings.get<string>("prefix")) ?? (this.client as Client).config.defaultPrefix;
            }

            return this._prefix;
        }
    };
});
