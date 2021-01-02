/* Main Dependencies */
import { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } from "discord-akairo";
import { join } from "path";
import { Message, Collection, MessageEmbed, Intents } from "discord.js";

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
import {
    Moderation,
    Logging,
    Tags,
    Suggestion,
    ReactionRoles,
    MessageFilter,
    Ticketing,
    Giveaway,
} from "../../plugins";
import API from "../../plugins/api";

export default class YokiClient extends AkairoClient {
    public constructor(public readonly config: ClientOptions) {
        super(
            {
                ownerID: ["500765481788112916"],
            },
            {
                disableMentions: "everyone",
                partials: ["MESSAGE", "CHANNEL", "REACTION"],
                messageCacheMaxSize: 25,
                messageCacheLifetime: 86400,
                messageSweepInterval: 43200,
                messageEditHistoryMaxSize: 2,
                ws: {
                    intents: [Intents.NON_PRIVILEGED, Intents.FLAGS.GUILD_MEMBERS],
                },
            },
        );

        this.Embeds = Responses;
        this.Responses = Constants;
        this.Modules = new Collection<string, YokiModule>();
        this.colors = YokiColors;
        this.Logger = new Logger();

        this.db = new DatabaseManager(config.dbEnv);

        this.commandHandler = new CommandHandler(this, {
            directory: `${__dirname}/../commands/`,
            prefix: async (message: Message) => (await message.guild?.prefix().catch()) ?? this.config.defaultPrefix,
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
        this.Modules.set("ticketing", await new Ticketing(this).load());
        this.Modules.set("reaction-roles", await new ReactionRoles(this).load());
        this.Modules.set("suggestions", await new Suggestion(this).load());
        this.Modules.set("giveaways", await new Giveaway(this).load());
        this.external_api = API(this);
        this.external_api.listen(this.config.api_port, "0.0.0.0", () =>
            this.Logger.log(`[API] Server started at port ${this.config.api_port}`),
        );
        return 0;
    }

    public async login(token: string) {
        await this._init();
        await this._loadModules();
        this.Logger.log("----Bot Initialized----");
        this.Logger.log("Logging in...");
        return super.login(token);
    }
}
