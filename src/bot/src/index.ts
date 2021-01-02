import Client from "./core/client/Client";
import { ClientOptions } from "./core/typings/ClientOptions";
// @ts-ignore
import DBEnviroment from "../../../knexfile";
import { Config } from "knex";

void (async () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
        const dotenv = await import("dotenv");
        dotenv.config({
            path: `${__dirname}/../../../bot.env`,
        });
    }

    if (!process.env.DEFAULTPREFIX) throw new Error("Must provide a prefix!");
    if (!process.env.TOKEN) throw new Error("Must provide a token");

    const dbEnv: Config = DBEnviroment;

    const options: ClientOptions = {
        dbEnv: dbEnv,
        defaultPrefix: process.env.DEFAULTPREFIX,
        api_port: Number(process.env.API_PORT ?? 80),
    };
    const BotClient = new Client(options);
    try {
        await BotClient.login(process.env.TOKEN);
    } catch (e) {
        throw new Error(`Error logging in with provided token! ${e}`);
    }
})();
