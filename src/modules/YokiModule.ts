import { AkairoClient } from "discord-akairo";
import { YokiModuleConfig } from "../typings/YokiModuleConfig";

export default class YokiModule {
    public constructor(public options: YokiModuleConfig, private readonly client: AkairoClient) {}

    public load() {
        this.options.commandDirectory ? this.client.commandHandler.loadAll(this.options.commandDirectory) : void 0;
        this.options.listenerDirectory ? this.client.listenerHandler.loadAll(this.options.listenerDirectory) : void 0;

        return this.client.Logger.log(`${this.options.name} (${this.options.id}) Module Loaded`);
    }
}
