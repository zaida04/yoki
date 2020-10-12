import { User } from "discord.js";

export default {
    BAN_MESSAGE: () => "",
    INCORRECT_USER: "Please provide a valid user",
    INCORRECT_MEMBER: "Please provide a valid member",
    SELF_ACTION: (action: string) => `As much as I'd love to ${action} you, you cannot ${action} yourself.`,
    NOT_ACTIONABLE: (action: string) =>
        `That person is not ${action}able by me! Please check that I have a higher role than them/correct permissions.`,
    INSUFFICENT_PERMISSIONS_HEADING: "Insufficent Permissions!",
    INSUFFICENT_PERMISSIONS_BODY: "You don't have permission to ban that person!",
    INVALID_MESSAGE_AMOUNT: "Please provide a valid amount of messages to delete.",
    NEW_ACTION_DESCRIPTION: (action: string, user: User, reason?: string) =>
        `\n\nAction: **${action}**\nTarget: ${user.tag} (${user.id})\nReason: **${reason ? reason : "Not Set"}**`,
    NEW_MODACTION_RESPONSE: (action: string, user: User, reason?: string) =>
        `${user} has been successfully ${action}. ${reason ? `\n**REASON**: \`${reason}\`` : ""}`,
    PURGE_RESPONSE: (amount: number, timeout: number) =>
        `\`${amount} message${
            amount > 1 ? "s" : ""
        }\` will be deleted. This message will also auto-delete in ${timeout} seconds`,
};
