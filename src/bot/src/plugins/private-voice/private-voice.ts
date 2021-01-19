import type { AkairoClient } from "discord-akairo";
import gamernestModule from "../../common/GamerNestModule";
import ChannelSweeper from "./util/ChannelSweeper";

export default class PrivateVoice extends gamernestModule {
    public sweeper = new ChannelSweeper(this.client, 8.64e7);

    public constructor(client: AkairoClient) {
        super(
            {
                id: "private-voice",
                name: "private-voice",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`,
            },
            client,
        );
    }
}
