import DatabaseManager from "../database/DatabaseManager";
import Logger from "../logger/Logger";
import { ClientOptions } from "./ClientOptions";
import Responses from "../bot/core/responses";
import Embeds from "../bot/core/structures/embeds/Embeds";
import YokiModule from "../bot/YokiModule";
import { Collection } from "discord.js";

declare module "discord-akairo" {
    interface AkairoClient {
        config: ClientOptions;
        db: DatabaseManager;
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        inhibitorHandler: InhibitorHandler;
        Logger: Logger;
        Embeds: typeof Embeds;
        Responses: typeof Responses;
        Modules: Collection<string, YokiModule>;
    }
    interface Command {
        sub_commands?: string[];
    }
}
