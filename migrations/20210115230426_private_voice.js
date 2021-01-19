exports.up = async function (knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.boolean("privateVoiceEnabled");
        table.string("privateVoiceChannel");
    });
    return knex.schema.createTable("privateVoice", (table) => {
        table.increments("id");
        table.string("guild_id");
        table.string("channel_id");
        table.string("creator");
        table.timestamps();
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable("settings", (table) => {
        table.dropColumn("privateVoiceEnabled");
        table.dropColumn("privateVoiceChannel");
    });
    return knex.schema.dropTable("privateVoice");
};
