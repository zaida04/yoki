import { AkairoClient } from "discord-akairo";
import YokiModule from "../../common/YokiModule";
import TagHandler from "./TagHandler";

export default class Tags extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "tags",
                name: "tags",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client,
        );
        this.client.tagHandler = new TagHandler(client);
    }
}
