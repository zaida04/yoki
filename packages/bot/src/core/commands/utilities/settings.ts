import { Argument } from "discord-akairo";
import { Command } from "discord-akairo";
import { Role } from "discord.js";
import { MessageEmbed } from "discord.js";
import { GuildChannel } from "discord.js";
import { TextChannel, VoiceChannel } from "discord.js";
import { Message } from "discord.js";
import { YokiColors } from "../../../common/YokiColors";
import { CustomizableSettings, CustomizableSettingsArr } from "../../../typings/CustomizableSettings";
const settingsKeys = Object.keys(CustomizableSettingsArr);

export default class Settings extends Command {
    public constructor() {
        super("settings", {
            aliases: ["settings", "setting"],
            userPermissions: ["MANAGE_GUILD"],
            ratelimit: 2,
            description: {
                content: "Change/Get settings for this server",
                usage: "<settings> [new-value]",
                example: [
                    "settings welcome-channel #otherchannel",
                    "settings welcome-channel 222086648706498562",
                    "settings mute-role RoleName",
                ],
            },
            category: "util",
            cooldown: 600000,
            channel: "guild",
            args: [
                {
                    id: "setting",
                    type: "string",
                    prompt: {
                        start: new MessageEmbed()
                            .setColor(YokiColors.YELLOW)
                            .setTitle("Please provide a setting to change")
                            .setDescription(`Your options are: ${settingsKeys.map((x) => `\`${x}\``).join(", ")}`),
                    },
                },
                {
                    id: "value",
                    prompt: {
                        start: new MessageEmbed()
                            .setColor(YokiColors.YELLOW)
                            .setTitle("Input required!")
                            .setDescription(`Please provide an input to change this setting to.`),
                    },
                    type: Argument.union("textChannel", "voiceChannel", "string", async (message, phrase) => {
                        const textChannel = message.guild?.channels.cache.filter((x) => x.type === "text").get(phrase);
                        if (textChannel) return textChannel;
                        const voiceChannel = await message.guild?.channels.cache
                            .filter((x) => x.type === "voice")
                            .get(phrase);
                        if (voiceChannel) return voiceChannel;
                        return null;
                    }),
                },
            ],
        });
    }

    public async exec(
        message: Message,
        { setting, value }: { setting: CustomizableSettings; value: TextChannel | VoiceChannel | string }
    ) {
        if (!settingsKeys.includes(setting))
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Incorrect Setting!",
                    `That is not a valid setting. Your options are: ${settingsKeys.map((x) => `\`${x}\``).join(", ")}
                        
                    You can also use our dashboard to change these settings.
                    `
                )
            );

        if (!value) {
            const current_value = await message.guild!.settings.get<string>(
                CustomizableSettingsArr[setting].mappedName
            );
            return message.channel.send(
                `Current value for ${setting} is ${current_value ? `\`${current_value}\`` : "`NOT SET`"}`
            );
        }

        const matched_setting = CustomizableSettingsArr[setting];
        switch (matched_setting.type) {
            case "textChannel": {
                if (!(value instanceof TextChannel))
                    return message.channel.send(
                        `Sorry, but that is not the proper argument. Expected a valid \`${matched_setting.type}\``
                    );
                break;
            }
            case "voiceChannel": {
                if (!(value instanceof VoiceChannel))
                    return message.channel.send(
                        `Sorry, but that is not the proper argument. Expected a valid \`${matched_setting.type}\``
                    );
                break;
            }
            case "role": {
                if (!(value instanceof Role))
                    return message.channel.send(
                        `Sorry, but that is not the proper argument. Expected a valid \`${matched_setting.type}\``
                    );
                break;
            }
        }
        await message.guild!.settings.update(
            matched_setting.mappedName,
            value instanceof GuildChannel ? value.id : value
        );

        return message.channel.send(
            new this.client.Embeds.SuccessEmbed(
                "Setting Changed!",
                `Setting \`${setting}\` has been changed to ${
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string
                    value instanceof TextChannel ? value.toString() : value instanceof VoiceChannel ? value.name : value
                }`,
                message
            )
        );
    }
}
