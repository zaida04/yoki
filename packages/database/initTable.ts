import knex, { TableBuilder } from "knex";

export default async function initTable(db: knex, name: string, config: (table: TableBuilder) => void) {
    const table = await db.schema.hasTable(name);
    if (!table) {
        await db.schema.createTable(name, (table) => {
            config(table);
        });
    }
}
