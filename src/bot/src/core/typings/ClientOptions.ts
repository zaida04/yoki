import { Config } from "knex";

export interface ClientOptions {
    dbEnv: Config;
    defaultPrefix: string;
}
