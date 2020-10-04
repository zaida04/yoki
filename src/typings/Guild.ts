import SettingsManager from "../core/managers/SettingsManager";

declare module "discord.js" {
    interface Guild {
        settings: SettingsManager;
    }
}
