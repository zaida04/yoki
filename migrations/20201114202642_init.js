exports.up = async function(knex) {
    await knex.schema.createTable("settings", (table) => {
        /**
         * General guild related information.
         */
        table.boolean("leftServer");
        table.boolean("premiumServer");
        table.string("id");
        table.string("customPrefix");
        table.date("joinedAt");
        table.timestamps(true, true);

        /**
         * Snowflake ID containing fields.
         */
        table.string("auditLogChannel");
        table.string("muteRole");
        table.string("moderationLogChannel");
        table.string("memberLogChannel");
        table.string("welcomeChannel");
        table.string("ticketParentCategory");
        table.string("privateVCCreationChannel");
        table.string("starboardChannel");

        /**
         * Bools.
         */
        table.boolean("messageFilterEnabled");
        table.boolean("autoModerationEnabled");
        table.boolean("levelingEnabled");
        table.boolean("starboardEnabled");

        /**
         * Etc.
         */
        table.integer("starRequirement");
    });

    /**
     * Actions such as a kick, ban, etc. produce a case entry.
     */
    await knex.schema.createTable("cases", (table) => {
        table.increments("caseID");
        table.string("caseExecutorID");
        table.string("guildID");
        table.string("logMessageID");
        table.string("targetUserID");
        table.boolean("expired");
        table.datetime('expirationDate', { precision: 4 }); 
        table.enum("caseType", ["KICK", "MUTE", "BAN", "SOFTBAN", "LOCKDOWN", "PURGE", "MULTIBAN", "UNBAN", "WARN"]);
        table.timestamps(true, true);
    });

    /**
     * Words/Phrases in the message filter.
     */
    await knex.schema.createTable("messageFilter", (table) => {
        table.increments("filterEntryID");
        table.string("guildID");
        table.string("blockedContent");
        table.string("creatorID");
        table.timestamps(true, true);
    });

    /**
     * Custom commands
     */
    await knex.schema.createTable("tags", (table) => {
        table.increments("tagID");
        table.string("tagContent");
        table.string("creatorID");
        table.string("guildID");
        table.string("tagName");
        table.boolean("resolveMentions");
        table.timestamps(true, true);
    });

    /**
     * Ticketing system.
     */
    await knex.schema.createTable("tickets", (table) => {
        table.increments("ticketID");
        table.string("ticketOpenerID");
        table.string("ticketMainReason");
        table.string("guildID");
        table.string("ticketChannelID");
        table.enum("status", ["CLOSED", "OPEN", "PENDING"]);
        table.timestamps(true, true);
    });

    /**
     * Reaction Roles
     */
    await knex.schema.createTable("reactionRoles", (table) => {
        table.increments("reactionRoleID");
        table.string("guildID");
        table.string("messageID");
        table.string("targetRoleID");
        table.string("reactionIDOrName");
        table.timestamps(true, true);
    });

    /**
     * Private Voice Channels.
     */
    await knex.schema.createTable("privateVoiceChannels", (table) => {
        table.increments("privateVoiceID");
        table.string("guildID");
        table.string("voiceChannnelID");
        table.string("creatorID");
        table.timestamps(true, true);
    });

    /**
     * Leveling System
     */
    await knex.schema.createTable("leveling", (table) => {
        table.increments("levelingID");
        table.float("currentXP");
        table.integer("currentLevel");
        table.string("userID");
        table.string("guildID");
        table.timestamps(true, true);
    });

    /**
     * Giveaway System.
     */
    await knex.schema.createTable("giveaways", (table) => {
        table.increments("giveawayID");
        table.string("guildID");
        table.string("sentMessageID");
        table.string("sentChannelID");
        table.string("title");
        table.string("description");
        table.string("entryEmojiIDOrName");
        table.string("creatorID");
        table.boolean("ended");
        table.integer("winnerAmount");
        table.datetime('expirationDate', { precision: 4 });        
        table.timestamps(true, true);
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTable("settings");
    await knex.schema.dropTable("cases");
    await knex.schema.dropTable("messageFilter");
    await knex.schema.dropTable("tags");
    await knex.schema.dropTable("tickets");
    await knex.schema.dropTable("reactionRoles");
    await knex.schema.dropTable("privateVoiceChannels");
    await knex.schema.dropTable("leveling");
    await knex.schema.dropTable("giveaways");
};
