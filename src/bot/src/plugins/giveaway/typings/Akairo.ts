import GiveawayManager from "../structures/GiveawayManager";

declare module "discord-akairo" {
    interface AkairoClient {
        giveaways: GiveawayManager;
    }
}
