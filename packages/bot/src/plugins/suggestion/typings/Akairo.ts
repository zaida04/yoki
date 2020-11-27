import SuggestionHandler from "../SuggestionHandler";

declare module "discord-akairo" {
    interface AkairoClient {
        suggestionHandler: SuggestionHandler;
    }
}
