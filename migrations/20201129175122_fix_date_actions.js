exports.up = async function (knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.timestamp("joinedDate").defaultTo(knex.fn.now()).alter();
    });
    await knex.schema.alterTable("actions", (table) => {
        table.timestamp("createdAt").defaultTo(knex.fn.now()).alter();
    });
    await knex.schema.alterTable("messageFilter", (table) => {
        table.timestamp("createdAt").defaultTo(knex.fn.now()).alter();
    });
    await knex.schema.alterTable("tags", (table) => {
        table.timestamp("createdAt").defaultTo(knex.fn.now()).alter();
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.date("joinedDate").defaultTo(knex.fn.now()).alter();
    });
    await knex.schema.alterTable("actions", (table) => {
        table.date("createdAt").defaultTo(knex.fn.now()).alter();
    });
    await knex.schema.alterTable("messageFilter", (table) => {
        table.date("createdAt").defaultTo(knex.fn.now()).alter();
    });
    await knex.schema.alterTable("tags", (table) => {
        table.date("createdAt").defaultTo(knex.fn.now()).alter();
    });
};
