import Scheduler from "../../../common/Scheduler";
import Action from "../structures/Action";
import { ActionDatabaseData } from "../typings/Action";

export default class MuteHandler extends Scheduler<ActionDatabaseData> {
    public async sweep(action: ActionDatabaseData) {
        const guild = await this.client.guilds.fetch(action.guild).catch(() => null);
        if (!guild) return;
        const member = await guild.members.fetch(action.target_id).catch(() => null);
        if (!member) return;
        const guild_mute_role = await guild.settings.get<string>("muteRole");
        if (!guild_mute_role) return;
        if (guild_mute_role) void member.roles.remove(guild_mute_role, `Automatic unmute. Case #${action.id}`);
        await this.client.db.api<Action>("actions").where("id", action.id).update("expired", true);
    }

    public async sweeper() {
        const expired_cases = await this.client.db
            .api<ActionDatabaseData>("actions")
            .where("expired", false)
            .where("type", "mute")
            .where("expiration_date", "<", new Date(Date.now() + this.checkRate * 1000));

        this.client.Logger.log(
            `Sweeping mutes, ${expired_cases.length} case(s) found expired. ${
                expired_cases.length > 0 ? `IDS: ${expired_cases.map((x) => x.id).join(", ")}` : ""
            }`,
        );
        for (const action of expired_cases) {
            const timeout = new Date(action.expiration_date!).getTime() - Date.now();
            this.timeouts.set(
                action.id,
                this.client.setTimeout(
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    () => this.sweep(action),
                    timeout < 1 ? 10000 : timeout,
                ),
            );
        }
    }
}
