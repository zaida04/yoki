import DatabaseManager from "../database/DatabaseManager";
import Logger from "../logger/Logger";
import { ClientOptions } from "./ClientOptions";

declare module "discord-akairo" {
    interface AkairoClient {
        config: ClientOptions;
        db: DatabaseManager;
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        inhibitorHandler: InhibitorHandler;
        Logger: Logger;
    }
    interface Command {
        sub_commands?: string[];
    }
}
