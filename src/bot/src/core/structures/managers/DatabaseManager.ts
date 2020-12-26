import Knex, { Config } from "knex";

export default class DatabaseManager {
    public api: Knex;
    public constructor(dbENV: Config) {
        this.api = Knex(dbENV);
    }
}
