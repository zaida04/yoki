import FilterManager from "../FilterManager";

declare module "discord-akairo" {
    interface AkairoClient {
        messageFilter: FilterManager;
    }
}
