
exports.up = async function(knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.timestamps(true, true);
    });

    await knex.schema.alterTable("giveaways", (table) => {
        table.dropColumn("createdAt")
        table.timestamps(true, true);  
    });
    
    await knex.schema.alterTable("actions", (table) => {
        table.dropColumn("createdAt")
        table.timestamps(true, true);
    });

    await knex.schema.alterTable("messageFilter", (table) => {
        table.dropColumn("createdAt")
        table.timestamps(true, true);
    });
    await knex.schema.alterTable("tags", (table) => {
        table.dropColumn("createdAt")
        table.timestamps(true, true);
    });
    await knex.schema.alterTable("tickets", (table) => {
        table.timestamps(true, true);
    });
    await knex.schema.alterTable("reaction_roles", (table) => {
        table.timestamps(true, true);
    });
    await knex.schema.alterTable("suggestions", (table) => {
        table.timestamps(true, true);
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.dropTimestamps(true, true);
    });

    await knex.schema.alterTable("giveaways", (table) => {
        table.date("createdAt").defaultTo(knex.fn.now()).alter();
        table.dropTimestamps (true, true);
    });

    await knex.schema.alterTable("actions", (table) => {
        table.date("createdAt").defaultTo(knex.fn.now()).alter();
        table.dropTimestamps (true, true);
    });

    await knex.schema.alterTable("messageFilter", (table) => {
        table.date("createdAt").defaultTo(knex.fn.now()).alter();
        table.dropTimestamps (true, true);
    });
    await knex.schema.alterTable("tags", (table) => {
        table.date("createdAt").defaultTo(knex.fn.now()).alter();
        table.dropTimestamps (true, true);
    });
    await knex.schema.alterTable("tickets", (table) => {
        table.dropTimestamps (true, true);
    });
    await knex.schema.alterTable("reaction_roles", (table) => {
        table.dropTimestamps (true, true);
    });
    await knex.schema.alterTable("suggestions", (table) => {
        table.dropTimestamps(true, true);
    });
};
