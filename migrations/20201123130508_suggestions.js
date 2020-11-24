exports.up = function (knex) {
    return knex.schema.createTable("suggestions", (table) => {
        table.increments("id");
        table.string("opener_id");
        table.string("guild_id");
        table.string("message_id");
        table.string("channel_id");
        table.description("description");
        table.string("status");
        table.string("comments");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("suggestions");
};
