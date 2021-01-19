import { Listener } from "discord-akairo";
import { Collection, MessageEmbed, MessageAttachment } from "discord.js";
import { TextChannel, Message } from "discord.js";
import { handleMissingSend } from "../../../common/PermissionUtil";
import { GamerNestColors } from "../../../common/GamerNestColors";

export default class messageDeleteBulk extends Listener {
    public constructor() {
        super("logging-messageDeleteBulk", {
            emitter: "client",
            event: "messageDeleteBulk",
        });
    }

    public async exec(messages: Collection<string, Message>) {
        if (!messages.first() || !messages.first()?.guild) return;
        const logChannel = await messages.first()!.guild!.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const deletion_content = messages
            .filter((x) => x.author.id !== this.client.user!.id)
            .map((x: Message) =>
                x.author.bot
                    ? "MESSAGE FROM BOT"
                    : `Author: ${x.author.tag} (${x.author.id}) | Content: ${x.content ? x.content : "No Content"}`,
            );

        const embed = new MessageEmbed()
            .setColor(GamerNestColors.GREEN)
            .setTitle("Messages Deleted in bulk")
            .setDescription(`Attached file contains deleted messages from ${messages.first()?.channel}`)
            .setTimestamp();
        logChannel
            .send({
                embed,
                files: [new MessageAttachment(Buffer.from(deletion_content.join("\n")), `${Date.now()}-MESSAGES.txt`)],
            })
            .catch((e) => handleMissingSend(e, logChannel, messages.first()!.guild!));
    }
}
