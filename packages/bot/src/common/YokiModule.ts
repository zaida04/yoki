import { colors } from "@yoki/logger";
import { Command } from "discord-akairo";
import { Listener } from "discord-akairo";
import { AkairoClient } from "discord-akairo";
import { Collection } from "discord.js";

export default abstract class YokiModule {
    public commands!: Collection<string, Command>;
    public listeners!: Collection<string, Listener>;
    public constructor(public options: YokiModuleConfig, public client: AkairoClient) {}

    public load() {
        this.options.commandDirectory ? this.client.commandHandler.loadAll(this.options.commandDirectory) : void 0;
        this.options.listenerDirectory ? this.client.listenerHandler.loadAll(this.options.listenerDirectory) : void 0;
        this.client.Logger.log(`${this.options.name} (${this.options.id}) Module Loaded`, colors.YELLOW);
        this.commands = this.client.commandHandler.modules.filter((x) => x.module === this.options.id);
        this.listeners = this.client.listenerHandler.modules.filter((x) => x.module === this.options.id);
        return this;
    }
}

export interface YokiModuleConfig {
    id: string;
    name: string;
    commandDirectory?: string;
    listenerDirectory?: string;
}
