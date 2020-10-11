import { Listener } from "discord-akairo";
import { Role } from "discord.js";

export default class RoleCreateListener extends Listener {
    public constructor() {
        super("roleCreate", {
            emitter: "client",
            event: "roleCreate",
        });
    }

    public exec(role: Role) {
        this.client.Logger.log(`Role ${role.name} (${role.id}) created in guild ${role.guild.name} (${role.guild.id})`);
    }
}
