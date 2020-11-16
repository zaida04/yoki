/* Main Dependencies */
import { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } from "discord-akairo";
import { join } from "path";
import { Message, Collection, MessageEmbed } from "discord.js";

/* Typings */
import "../typings/Akairo";
import "../typings/Guild";
import "../structures/discord.js/Guild";
import { ClientOptions } from "../typings/ClientOptions";

/* Helper Structures */
import Logger from "@yoki/logger";
import DatabaseManager from "../structures/managers/DatabaseManager";
import Responses from "../structures/embeds/Embeds";
import Constants from "../responses";
import { YokiColors } from "../../common/YokiColors";

/* Yoki Modules */
import YokiModule from "../../common/YokiModule";
import Moderation from "../../moderation/moderation";
import Logging from "../../logging/logging";
import Tags from "../../tags/tags";
import MessageFilter from "../../messageFilter/messageFilter";

export default class YokiClient extends AkairoClient {
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
        this.Embeds = Responses;
        this.Responses = Constants;
        this.Modules = new Collection<string, YokiModule>();
        this.colors = YokiColors;
        this.Logger = new Logger();

        this.db = new DatabaseManager(config.dbEnv);

        this.commandHandler = new CommandHandler(this, {
            directory: `${__dirname}/../commands/`,
            prefix: async (message: Message) => (await message.guild?.prefix()) ?? this.config.defaultPrefix,
            allowMention: true,
            defaultCooldown: 5000,
            commandUtil: false,
            argumentDefaults: {
                prompt: {
                    retries: 3,
                    retry: new MessageEmbed()
                        .setColor(YokiColors.YELLOW)
                        .setTitle("Please try again")
                        .setDescription("Your argument was not proper, please try again."),
                    timeout: new MessageEmbed()
                        .setColor(YokiColors.ORANGE_RED)
                        .setTitle("Command Cancelled")
                        .setDescription("You have run out of time!"),
                    cancel: new MessageEmbed()
                        .setColor(YokiColors.ORANGE_RED)
                        .setTitle("Command Cancelled")
                        .setDescription("Command has been cancelled."),
                    ended: new MessageEmbed()
                        .setColor(YokiColors.RED)
                        .setTitle("Command Cancelled")
                        .setDescription("Proper argument was not provided."),
                },
            },
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

    private async _loadModules() {
        this.Modules.set("moderation", await new Moderation(this).load());
        this.Modules.set("logging", await new Logging(this).load());
        this.Modules.set("messageFilter", await new MessageFilter(this).load());
        this.Modules.set("tags", await new Tags(this).load());
        return 0;
    }

    public async login(token: string) {
        await this._init();
        await this._loadModules();
        console.table(
            this.commandHandler.categories.map((x) => [
                x.id,
                this.commandHandler.modules
                    .filter((y) => y.categoryID === x.id)
                    .map((x) => x.id)
                    .join(", "),
            ])
        );
        this.Logger.log("Logging in...");
        return super.login(token);
    }
}
