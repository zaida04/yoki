exports.up = async function (knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.timestamp("expiration_date").defaultTo(null);
    });
};

exports.down = function (knex) {};
