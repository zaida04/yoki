import DatabaseManager from "@yoki/database";
import Logger from "@yoki/logger";
import { ClientOptions } from "./ClientOptions";
import Responses from "../core/responses";
import Embeds from "../core/structures/embeds/Embeds";
import YokiModule from "../common/YokiModule";
import { Collection } from "discord.js";

import "./Moderation";
import { YokiColors } from "../common/YokiColors";

declare module "discord-akairo" {
    interface AkairoClient {
        config: ClientOptions;
        db: DatabaseManager;
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        colors: typeof YokiColors;
        inhibitorHandler: InhibitorHandler;
        Logger: Logger;
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
