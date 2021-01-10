exports.up = function (knex) {
    return knex.schema.alterTable("actions", (table) => {
        table.boolean("expired");
        table.datetime("expiration_date", {
            precision: 4
        }).nullable().defaultTo(null);
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable("actions", (table) => {
        table.dropColumn("expiration_date");
        table.dropColumn("expired");
    });
};
