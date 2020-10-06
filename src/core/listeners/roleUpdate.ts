import { Role } from "discord.js";
import { Listener } from "discord-akairo";

export default class RoleUpdateListener extends Listener {
    public constructor() {
        super("roleUpdate", {
            emitter: "client",
            event: "roleUpdate",
        });
    }

    public exec(oldRole: Role, newRole: Role) {}
}
