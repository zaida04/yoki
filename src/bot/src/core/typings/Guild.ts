import SettingsManager from "../structures/managers/SettingsManager";

declare module "discord.js" {
    interface Guild {
        settings: SettingsManager;
        messageFilter?: boolean;
        _prefix?: string;
        prefix(force?: boolean): Promise<string>;
    }
}
