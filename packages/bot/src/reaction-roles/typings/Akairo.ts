import ReactionRoleHandler from "../ReactionRoleHandler";

declare module "discord-akairo" {
    interface AkairoClient {
        rrHandler: ReactionRoleHandler;
    }
}
