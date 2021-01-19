import { stripIndents } from "common-tags";
import { Listener } from "discord-akairo";
import type { TextChannel, Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { handleMissingSend } from "../../../common/PermissionUtil";
import { GamerNestColors } from "../../../common/GamerNestColors";

export default class messageDelete extends Listener {
    public constructor() {
        super("logging-messageDelete", {
            emitter: "client",
            event: "messageDelete",
        });
    }

    public async exec(message: Message) {
        if (!message.guild) return;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!message.partial) {
            if (message.author.id === message.client.user!.id) return;
            const possibleCase = this.client.moderation.caseActions.cache.find(
                (x) => x.executor.id === message.author.id && x.reason === "`Triggered the message filter`",
            );
            if (possibleCase) {
                this.client.moderation.caseActions.cache.delete(possibleCase.id);
                return;
            }
        }

        const logChannel = await message.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor(GamerNestColors.GREEN)
            .setTitle("Message Deleted")
            .setDescription(
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                stripIndents`**Author:** ${message.partial ? `\`${message.author.tag}\`` : "`Unknown User`"}
                **Channel:** ${message.channel}
                **Embeds?**: ${Boolean(message.embeds.length)}
                **Content:** ${
                    message.content
                        ? `\`\`\`${message.content}\`\`\``
                        : "`No detectable content (Possibly only embeds)`"
                }`,
            )
            .setTimestamp();

        if (
            message.attachments.size > 0 &&
            ["gif", "jpg", "png", "jpeg"].some((x) => message.attachments.first()?.name?.endsWith(x))
        )
            embed.setImage(message.attachments.first()!.url);
        logChannel.send(embed).catch((e) => handleMissingSend(e, logChannel, message.guild!));
    }
}
