import Client from "./core/client/Client";
import { config } from "dotenv";
import { ClientOptions } from "./core/typings/ClientOptions";
// @ts-ignore
import DBEnviroment from "../../../knexfile.example";

import { Config } from "knex";
config({
    path: `${__dirname}/../../../bot.env`,
});

if (!process.env.DEFAULTPREFIX) throw new Error("Must provide a prefix!");
if (!process.env.TOKEN) throw new Error("Must provide a token");

const dbEnv: Config = DBEnviroment.development;

const options: ClientOptions = {
    dbEnv: dbEnv,
    defaultPrefix: process.env.DEFAULTPREFIX,
};

const BotClient = new Client(options);
void BotClient.login(process.env.TOKEN);
