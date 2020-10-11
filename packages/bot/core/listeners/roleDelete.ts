import { Listener } from "discord-akairo";
import { Role } from "discord.js";
export default class RoleCreateListener extends Listener {
    public constructor() {
        super("roleDelete", {
            emitter: "client",
            event: "roleDelete",
        });
    }

    public exec(role: Role) {
        this.client.Logger.log(`Role ${role.name} (${role.id}) deleted in guild ${role.guild.name} (${role.guild.id})`);
    }
}
