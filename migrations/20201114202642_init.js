/* eslint-disable func-names */
exports.up = async function (knex) {
    await knex.schema.createTable("settings", (table) => {
        table.boolean("left");
        table.boolean("premium");
        table.string("guild");
        table.string("logChannel");
        table.string("modLogChannel");
        table.string("memberLog");
        table.string("muteRole");
        table.string("prefix");
        table.string("welcomeChannel");
        table.string("welcomeMessage");
        table.string("leaveMessage");
        table.string("ticketCategory");
        table.date("joinedDate");

        /* Enabled */
        table.boolean("messageFilterEnabled");
        table.boolean("autoModEnabled");
    });

    await knex.schema.createTable("actions", (table) => {
        table.increments("id");
        table.string("channel_id");
        table.string("executor_id");
        table.string("guild");
        table.string("message_id");
        table.string("reason");
        table.string("target_id");
        table.string("type");
        table.date("createdAt");
    });
    await knex.schema.createTable("messageFilter", (table) => {
        table.string("guild_id");
        table.string("content");
        table.string("creator_id");
        table.date("createdAt");
    });
    await knex.schema.createTable("tags", (table) => {
        table.increments("id");
        table.string("content");
        table.date("createdAt");
        table.string("creator_id");
        table.string("guild_id");
        table.string("name");
    });
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
