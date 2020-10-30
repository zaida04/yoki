import { GuildMember } from "discord.js";
import { PermissionResolvable } from "discord.js";

export function hasAnyPermission(member: GuildMember, permissions: PermissionResolvable[]): null | string {
    for (const permission of permissions) {
        if (!member.hasPermission(permission)) return `Missing permission ${permission}`;
    }
    return null;
}
