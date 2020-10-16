import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { CustomizableSettings, CustomizableSettingsArr } from "../../../typings/CustomizableSettings";

export default class Settings extends Command {
    private readonly settingsKey: string[];
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
                    type: "string",
                },
            ],
        });
        this.settingsKey = Object.keys(CustomizableSettingsArr);
    }

    public async exec(message: Message, { setting, value }: { setting: CustomizableSettings; value: string }) {
        if (!this.settingsKey.includes(setting))
            return message.channel.send(
                new this.client.Embeds.ErrorEmbed(
                    "Incorrect Setting!",
                    `That is not a valid setting. Your options are: ${this.settingsKey
                        .map((x) => `\`${x}\``)
                        .join(", ")}`
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

        await message.guild!.settings.update(CustomizableSettingsArr[setting].mappedName, value);

        return message.channel.send(
            new this.client.Embeds.SuccessEmbed(
                "Setting Changed!",
                `Setting \`${setting}\` has been changed to ${value}`,
                message
            )
        );
    }
}
