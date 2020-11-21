import { GuildMember } from "discord.js";
import { PermissionResolvable } from "discord.js";

export function hasAnyPermission(member: GuildMember, permissions: PermissionResolvable[]): null | string {
    const missing: string[] = [];
    for (const permission of permissions) {
        if (!member.hasPermission(permission)) missing.push(permission.toString());
    }
    return missing.length ? `missing any of these permissions: ${missing.map(x => `\`${x}\``).join(", ")}` : null;
}
