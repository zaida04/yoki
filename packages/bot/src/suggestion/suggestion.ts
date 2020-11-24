import { AkairoClient } from "discord-akairo";
import YokiModule from "../common/YokiModule";
import SuggestionHandler from "./SuggestionHandler";

export default class Suggestion extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "suggestion",
                name: "suggestion",
                commandDirectory: `${__dirname}/commands/`,
            },
            client
        );
        this.client.suggestionHandler = new SuggestionHandler(client);
    }
}
