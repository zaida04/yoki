import { Argument } from "discord-akairo";
import { Command } from "discord-akairo";
import { Role } from "discord.js";

import { GuildChannel } from "discord.js";
import { TextChannel, VoiceChannel } from "discord.js";
import { Message } from "discord.js";

import { CustomizableSettings, CustomizableSettingsArr } from "../../typings/CustomizableSettings";
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
                },
                {
                    id: "value",
                    match: "rest",
                    type: Argument.union("textChannel", "voiceChannel", "role", "string", async (message, phrase) => {
                        const textChannel = message.guild?.channels.cache.filter((x) => x.type === "text").get(phrase);
                        if (textChannel) return textChannel;
                        const voiceChannel = await message.guild?.channels.cache
                            .filter((x) => x.type === "voice")
                            .get(phrase);
                        if (voiceChannel) return voiceChannel;
                        const role = phrase ? await message.guild?.roles.fetch(phrase) : null;
                        if (role) return role;
                        return null;
                    }),
                },
            ],
        });
    }

    public async exec(
        message: Message,
        {
            setting,
            value,
        }: { setting?: CustomizableSettings; value?: TextChannel | VoiceChannel | Role | boolean | null | string }
    ) {
        if (!setting)
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Settings Options",
                    `Your options are: ${settingsKeys.map((x) => `\`${x}\``).join(", ")}. 
                        
                    If you want to set a setting to nothing, pass the word \`none\``
                ).setColor("GOLD")
            );
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
            const possible_channel = current_value ? message.guild?.channels.cache.get(current_value) : null;
            return message.channel.send(
                `Current value for ${setting} is: ${
                    current_value
                        ? possible_channel instanceof TextChannel
                            ? possible_channel.toString()
                            : possible_channel instanceof VoiceChannel
                            ? possible_channel
                            : `\`${current_value}\``
                        : `\`none\``
                }`
            );
        }

        const matched_setting = CustomizableSettingsArr[setting];
        if (value === "none") value = null;
        else {
            switch (matched_setting.type) {
                case "textChannel": {
                    if (!(value instanceof TextChannel))
                        return message.channel.send(
                            `Sorry, but that is not the proper argument. Expected a valid \`text channel\``
                        );
                    break;
                }
                case "voiceChannel": {
                    if (!(value instanceof VoiceChannel))
                        return message.channel.send(
                            `Sorry, but that is not the proper argument. Expected a valid \`voice channel\``
                        );
                    break;
                }
                case "role": {
                    if (!(value instanceof Role))
                        return message.channel.send(
                            `Sorry, but that is not the proper argument. Expected a valid \`role\``
                        );
                    break;
                }
                case "y/n": {
                    if (typeof value !== "string") return message.channel.send("Must supply text!");
                    switch (value.toLowerCase()) {
                        case "yes":
                        case "y":
                        case "enable":
                        case "enabled": {
                            value = true;
                            break;
                        }
                        case "no":
                        case "n":
                        case "disable":
                        case "disabled": {
                            value = false;
                            break;
                        }

                        default: {
                            return message.channel.send("Invalid option, please use either `enable` or `disable`");
                        }
                    }
                    break;
                }
            }
        }
        await message.guild!.settings.update(
            matched_setting.mappedName,
            value instanceof GuildChannel || value instanceof Role ? value.id : value
        );

        return message.channel.send(
            new this.client.Embeds.SuccessEmbed(
                "Success!",
                `\`${setting}\` has been changed to ${
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string
                    value instanceof TextChannel
                        ? value.toString()
                        : value instanceof VoiceChannel
                        ? value.name
                        : value === true
                        ? "`enabled`"
                        : value === false
                        ? "`disabled`"
                        : value === null
                        ? `\`none\``
                        : value
                }`,
                message
            )
        );
    }
}
