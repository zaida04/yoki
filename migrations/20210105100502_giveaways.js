exports.up = function (knex) {
    return knex.schema.createTable("giveaways", (table) => {
        table.increments("id");
        table.string("guild_id");
        table.string("message_id");
        table.string("channel_id");
        table.string("title");
        table.string("description");
        table.string("emoji");
        table.string("creator");
        table.boolean("customEmoji");
        table.boolean("ended");
        table.integer("winner_count");
        table.datetime('expiration_date', {
            precision: 4
        });
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("giveaways");
};