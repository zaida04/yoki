import { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } from "discord-akairo";
import { join } from "path";
import { ClientOptions } from "../../typings/ClientOptions";

import "../../typings/Akairo";
import "../../typings/Guild";
import Logger from "../../logger/Logger";
import DatabaseManager from "../../database/DatabaseManager";

export default class Client extends AkairoClient {
    public constructor(config: ClientOptions) {
        super(
            {
                ownerID: ["500765481788112916"],
            },
            {
                disableMentions: "everyone",
                partials: ["MESSAGE", "CHANNEL", "REACTION"],
            }
        );

        this.config = config;
        this.Logger = new Logger();
        this.db = new DatabaseManager(config.dbEnv, this);

        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, "/../commands/"),
            prefix: async (message) => {
                return (await message.guild?.settings.get("prefix")) ?? this.config.defaultPrefix;
            },
            allowMention: true,
            defaultCooldown: 5000,
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, "/../listeners/"),
        });
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(__dirname, "/../inhibitors/"),
        });
    }

    private _init() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            inhibitorHandler: this.inhibitorHandler,
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();
    }

    public async login(token: string) {
        this._init();
        this.Logger.log("Logging in...");
        return super.login(token);
    }
}
