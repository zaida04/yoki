import SettingsManager from "../structures/managers/SettingsManager";

declare module "discord.js" {
    interface Guild {
        settings: SettingsManager;
        messageFilter?: boolean;
    }
}
