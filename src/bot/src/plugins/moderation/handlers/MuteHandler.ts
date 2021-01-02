import Scheduler from "../../../common/Scheduler";
import Action from "../structures/Action";

export default class MuteHandler extends Scheduler<Action> {
    public init() {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.client.setInterval(async () => {
            const expired_cases = await this.client.db
                .api<Action>("actions")
                .whereNotNull("expiration_date")
                .where("expiration_date", "<", Date.now() + this.checkRate * 1000);

            for (const action of expired_cases) {
                this.timeouts.set(
                    action.id,
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    this.client.setTimeout(async () => {
                        const member = await action.guild.members.fetch(action.target.id).catch(() => null);
                        const guild_mute_role = await action.guild.settings.get<string>("muteRole");
                        if (!member) return;
                        if (guild_mute_role) void member.roles.remove(guild_mute_role);
                    }, new Date(action.expiration_date!).getTime() - Date.now()),
                );
            }
        }, this.checkRate);

        return void 0;
    }
}
