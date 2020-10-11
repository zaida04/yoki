import SettingsManager from "../core/structures/managers/SettingsManager";

declare module "discord.js" {
    interface Guild {
        settings: SettingsManager;
    }
}
