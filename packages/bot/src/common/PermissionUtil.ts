import { Guild } from "discord.js";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";
import { PermissionResolvable } from "discord.js";

export function hasAnyPermission(member: GuildMember, permissions: PermissionResolvable[]): null | string {
    const missing: string[] = [];
    for (const permission of permissions) {
        if (!member.hasPermission(permission)) missing.push(permission.toString());
    }
    return missing.length ? `missing any of these permissions: ${missing.map((x) => `\`${x}\``).join(" ")}` : null;
}

export function handleMissingSend(e, target: TextChannel, guild: Guild) {
    return (guild.channels.cache
        .filter((x) => x.type === "text")
        .find((x) =>
            guild.me ? Boolean(x.permissionsFor(guild.me)?.has("SEND_MESSAGES")) : false
        ) as TextChannel).send(`**Warning!:** I am missing permissions to send messages in ${target}!`);
}
