import LevelingHandler from "../util/LevelingHandler";
declare module "discord-akairo" {
    interface AkairoClient {
        leveling: LevelingHandler;
    }
}
