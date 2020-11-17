import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { DMChannel } from "discord.js";
import { GuildChannel } from "discord.js";

export default class channelDelete extends Listener {
    public constructor() {
        super("logging-channelDelete", {
            emitter: "client",
            event: "channelDelete",
        });
    }

    public async exec(channel: GuildChannel | DMChannel) {
        if (channel instanceof DMChannel) return;
        const logChannel = await channel.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Channel Deleted")
            .setDescription(
                `
            Name: \`${channel.name}\` 
            ID: \`(${channel.id})\``
            )
            .setTimestamp();
        void logChannel.send(embed);
    }
}
