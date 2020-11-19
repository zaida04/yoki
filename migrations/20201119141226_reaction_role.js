exports.up = function (knex) {
    return knex.schema.createTable("reaction_roles", (table) => {
        table.increments("id");
        table.string("guild_id");
        table.string("message_id");
        table.string("role_id");
        table.string("reaction");
        table.boolean("custom");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("reaction_roles");
};
