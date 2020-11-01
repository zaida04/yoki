import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { DMChannel } from "discord.js";
import { GuildChannel } from "discord.js";
import { retrieveLogChannel } from "../../common/retrieveChannel";

export default class channelCreate extends Listener {
    public constructor() {
        super("logging-channelCreate", {
            emitter: "client",
            event: "channelCreate",
        });
    }

    public async exec(channel: GuildChannel | DMChannel) {
        if (channel instanceof DMChannel) return;
        const logChannel = await retrieveLogChannel(channel.guild);
        if (!logChannel) return;

        const channelCreateEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Channel Created")
            .setDescription(
                `${channel instanceof TextChannel ? channel.toString() : channel.name} \`(${channel.id})\``
            );
        void logChannel.send(channelCreateEmbed);
    }
}
