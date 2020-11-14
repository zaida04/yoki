import knex, { Config, TableBuilder } from "knex";
import initTable from "./initTable";

export default class DatabaseManager {
    public api: knex;

    public constructor(dbENV: Config) {
        this.api = knex(dbENV);
    }

    public async init() {
        await initTable(this.api, "settings", (table: TableBuilder) => {
            table.boolean("left");
            table.boolean("premium");
            table.string("guild");
            table.string("logChannel");
            table.string("modLogChannel");
            table.string("memberLog");
            table.string("muteRole");
            table.string("prefix");
            table.string("welcomeChannel");
            table.string("welcomeMessage");
            table.string("leaveMessage");
            table.date("joinedDate");

            /* Enabled */
            table.boolean("messageFilterEnabled");
        });
        await initTable(this.api, "actions", (table: TableBuilder) => {
            table.increments("id");
            table.string("channel_id");
            table.string("executor_id");
            table.string("guild");
            table.string("message_id");
            table.string("reason");
            table.string("target_id");
            table.string("type");
            table.date("createdAt");
        });
        await initTable(this.api, "messageFilter", (table: TableBuilder) => {
            table.string("guild_id");
            table.string("content");
            table.string("creator_id");
            table.date("createdAt");
        });
        await initTable(this.api, "tags", (table: TableBuilder) => {
            table.increments("id");
            table.string("content");
            table.date("createdAt");
            table.string("creator_id");
            table.string("guild_id");
            table.string("name");
        });
    }
}
