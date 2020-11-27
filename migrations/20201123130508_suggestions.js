exports.up = function (knex) {
    return knex.schema.createTable("suggestions", (table) => {
        table.increments("id");
        table.string("opener_id");
        table.string("guild_id");
        table.string("message_id");
        table.string("channel_id");
        table.string("description");
        table.string("status");
        table.string("comment");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("suggestions");
};
