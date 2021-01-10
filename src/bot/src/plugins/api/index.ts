import { AkairoClient } from "discord-akairo";
import express, { Router, Response, Request, NextFunction } from "express";
import bodyParser from "body-parser";
import compression from "compression";

import filter from "./routes/filter";
import tags from "./routes/tags";
import settings from "./routes/settings";
import giveaways from "./routes/giveaways";

export default (client: AkairoClient) => {
    const http = express();
    http.bot_client = client;
    http.use(bodyParser.json());
    http.use(bodyParser.urlencoded({ extended: false }));
    http.use(compression());
    const api = Router({ mergeParams: true });
    const guilds = Router({ mergeParams: true });

    api.use((req: Request, res: Response, next: NextFunction) => {
        http.bot_client.Logger.log(`[API:${req.method.toUpperCase()}] Request at ${req.originalUrl} sent by ${req.ip}`);
        return next();
    });
    guilds.use(settings());
    guilds.use(filter());
    guilds.use(tags());
    guilds.use(giveaways());
    api.use("/guilds/:id", guilds);
    api.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
        if (process.env.NODE !== "production") http.bot_client.Logger.error(err.message);
        return res.status(400).json({
            error: {
                message: err.message,
                stack: process.env.NODE_ENV === "production" ? err.stack : undefined,
            },
        });
    });

    api.use("*", (req: Request, res: Response) => {
        return res.status(404).json({
            error: {
                global: true,
                message: "That page doesn't exist.",
            },
        });
    });

    http.use("/api", api);
    return http;
};
