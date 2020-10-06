import { Listener } from "discord-akairo";
import { Role } from "discord.js";

export default class RoleCreateListener extends Listener {
    public constructor() {
        super("roleCreate", {
            emitter: "client",
            event: "roleCreate",
        });
    }

    public exec(role: Role) {}
}
