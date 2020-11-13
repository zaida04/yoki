import TagHandler from "../TagHandler";

declare module "discord-akairo" {
    interface AkairoClient {
        tagHandler: TagHandler;
    }
}
