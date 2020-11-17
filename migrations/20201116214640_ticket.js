/* eslint-disable func-names */
exports.up = function (knex) {
    return knex.schema.createTable("tickets", (table) => {
        table.increments("id");
        table.string("opener_id");
        table.string("reason");
        table.string("guild_id");
        table.string("channel_id");
        table.boolean("closed");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("tickets");
};
