import DatabaseManager from "../structures/managers/DatabaseManager";
import Logger from "@yoki/logger";
import { ClientOptions } from "./ClientOptions";
import Responses from "../responses";
import Embeds from "../structures/embeds/Embeds";
import YokiModule from "../../common/YokiModule";
import { Collection } from "discord.js";

import { YokiColors } from "../../common/YokiColors";
import { Application } from "express";

declare module "discord-akairo" {
    interface AkairoClient {
        config: ClientOptions;
        db: DatabaseManager;
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        colors: typeof YokiColors;
        inhibitorHandler: InhibitorHandler;
        Logger: Logger;
        external_api: Application;
        Embeds: typeof Embeds;
        Responses: typeof Responses;
        Modules: Collection<string, YokiModule>;
    }
    interface Command {
        subCommands?: string[][];
        module?: string;
    }
    interface Listener {
        module?: string;
    }
    interface CommandOptions {
        subCommands?: string[][];
        module?: string;
    }
}
