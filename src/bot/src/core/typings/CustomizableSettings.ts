export type CustomizableSettings =
    | "log-channel"
    | "mute-role"
    | "welcome-channel"
    | "mod-log"
    | "message-filter"
    | "member-log"
    | "welcome-message"
    | "leave-message"
    | "ticket-category"
    | "suggestion-channel";
export const CustomizableSettingsArr = {
    "log-channel": {
        mappedName: "logChannel",
        type: "textChannel",
    },
    "mute-role": {
        mappedName: "muteRole",
        type: "role",
    },
    "welcome-channel": {
        mappedName: "welcomeChannel",
        type: "textChannel",
    },
    "mod-log": {
        mappedName: "modLogChannel",
        type: "textChannel",
    },
    "message-filter": {
        mappedName: "messageFilterEnabled",
        type: "y/n",
    },
    "member-log": {
        mappedName: "memberLog",
        type: "textChannel",
    },
    "welcome-message": {
        mappedName: "welcomeMessage",
        type: "string",
    },
    "leave-message": {
        mappedName: "leaveMessage",
        type: "string",
    },
    "ticket-category": {
        mappedName: "ticketCategory",
        type: "categoryChannel",
    },
    "suggestion-channel": {
        mappedName: "suggestionChannel",
        type: "textChannel",
    },
};
