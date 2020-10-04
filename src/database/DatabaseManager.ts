import knex, { Config, TableBuilder } from "knex";
import { AkairoClient } from "discord-akairo";

export default class DatabaseManager {
    public api: knex;
    private readonly client: AkairoClient;

    public constructor(dbENV: Config, client: AkairoClient) {
        this.api = knex(dbENV);
        this.client = client;
    }

    private async init() {
        await this.initTable(this.api, "settings", (table: TableBuilder) => {
            table.increments("guild_id");
            table.string("prefix");
        });
    }

    private async initTable(db: knex, name: string, config: (table: TableBuilder) => void) {
        const table = await db.schema.hasTable(name);
        if (!table) {
            await db.schema.createTable(name, (table) => {
                config(table);
            });
        }
    }
}
