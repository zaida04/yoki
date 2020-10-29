import { colors } from "@yoki/logger";
import { AkairoClient } from "discord-akairo";
import { YokiModuleConfig } from "./YokiModuleConfig";

export default abstract class YokiModule {
    public constructor(public options: YokiModuleConfig, public client: AkairoClient) {}

    public load() {
        this.options.commandDirectory ? this.client.commandHandler.loadAll(this.options.commandDirectory) : void 0;
        this.options.listenerDirectory ? this.client.listenerHandler.loadAll(this.options.listenerDirectory) : void 0;
        this.client.Logger.log(`${this.options.name} (${this.options.id}) Module Loaded`, colors.YELLOW);
        return this;
    }
}
