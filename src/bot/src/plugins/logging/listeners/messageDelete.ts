import { stripIndents } from "common-tags";
import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { handleMissingSend } from "../../../common/PermissionUtil";
import { YokiColors } from "../../../common/YokiColors";

export default class messageDelete extends Listener {
    public constructor() {
        super("logging-messageDelete", {
            emitter: "client",
            event: "messageDelete",
        });
    }

    public async exec(message: Message) {
        if (!message.guild) return;
        if (message.author.id === message.client.user!.id) return;
        const possibleCase = this.client.caseActions.cache.find(
            (x) => x.executor.id === message.author.id && x.reason === "`Triggered the message filter`",
        );
        if (possibleCase) {
            this.client.caseActions.cache.delete(possibleCase.id);
            return;
        }
        const logChannel = await message.guild.settings.channel<TextChannel>("logChannel", "text");
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor(YokiColors.GREEN)
            .setTitle("Message Deleted")
            .setDescription(
                stripIndents`**Author:** ${message.author.tag}
                **Content:** ${message.content ? `\`\`\`${message.content}\`\`\`` : "`No detectable content`"}`,
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
