
exports.up = async function(knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.boolean("levelingEnabled");
    });
    return knex.schema.createTable("leveling", (table) => {
        table.increments("id");
        table.float("xp");
        table.integer("level");
        table.string("user_id");
        table.string("guild_id");
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.dropColumn("levelingEnabled");
    });
    return knex.schema.dropTable("leveling");
};
