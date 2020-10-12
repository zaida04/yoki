import { Guild } from "discord.js";
import { User } from "discord.js";
import Action from "../../moderation/structures/Action";
import ActionEmbed from "../structures/ActionEmbed";
import LogListener from "./LogListener";

export default class guildBanAdd extends LogListener {
    public constructor() {
        super("listener-guildBanAdd", "guildBanAdd");
    }

    public async exec(guild: Guild, user: User) {
        const logChannel = await this.retrieveLogChannel(guild);
        if (!logChannel) return;

        if (this.client.caseActions.cache.some((x: Action) => x.user.id === user.id && x.type === "kick")) {
            const cached = this.client.caseActions.cache.find(
                (x: Action) => x.user.id === user.id && x.type === "kick"
            );
            return logChannel.send(new ActionEmbed(cached!));
        }

        return void 0;
    }
}
