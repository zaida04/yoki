import knex, { Config, TableBuilder } from "knex";
import initTable from "./initTable";

export default class DatabaseManager {
    public api: knex;

    public constructor(dbENV: Config) {
        this.api = knex(dbENV);
    }

    public async init() {
        await initTable(this.api, "settings", (table: TableBuilder) => {
            table.increments("guild_id");
            table.string("prefix");
            table.boolean("premium");
        });
    }
}
