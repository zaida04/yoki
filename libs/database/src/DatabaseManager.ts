import knex, { Config, TableBuilder } from "knex";
import initTable from "./initTable";

export default class DatabaseManager {
    public api: knex;

    public constructor(dbENV: Config) {
        this.api = knex(dbENV);
    }

    public async init() {
        await initTable(this.api, "settings", (table: TableBuilder) => {
            table.increments("guild");
            table.string("prefix");
            table.string("logChannel");
            table.string("muteRole");
            table.string("welcomeChannel");
            table.string("modLogChannel");
            table.string("welcomeMessage");
            table.boolean("premium");
            table.boolean("left");
        });
        await initTable(this.api, "actions", (table: TableBuilder) => {
            table.increments("id");
            table.string("guild");
            table.string("type");
            table.string("user");
            table.string("executor");
            table.string("reason");
            table.string("message_id");
            table.string("channel_id");
        });
        await initTable(this.api, "tags", (table: TableBuilder) => {
            table.string("guild");
            table.string("name");
            table.string("content");
            table.string("creator");
            table.string("createdAt");
            table.boolean("boolean");
        });
    }
}
