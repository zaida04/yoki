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

    const dbEnv: Config =
        process.env.NODE_ENV === "production"
            ? DBEnviroment.production
            : DBEnviroment.development ?? DBEnviroment.production;

    const options: ClientOptions = {
        dbEnv: dbEnv,
        defaultPrefix: process.env.DEFAULTPREFIX,
    };
    console.log(options);
    const BotClient = new Client(options);
    void BotClient.login(process.env.TOKEN);
})();
