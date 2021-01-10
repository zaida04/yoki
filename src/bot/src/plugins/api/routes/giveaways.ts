import routeValidator from "../util/routeValidator";
import { Response, Request, Router } from "express";
import { body } from "express-validator";
import { TextChannel } from "discord.js";

export default () => {
    const router = Router({ mergeParams: true });

    router
        .route("/giveaways")
        .post(
            routeValidator(
                body("channel_id", "Must provide a valid channel id to send the giveaway to.")
                    .notEmpty()
                    .bail()
                    .isString()
                    .bail()
                    .isLength({ max: 19, min: 17 }),
                body("creator_id", "Must provide a valid user id of the creator of this giveaway.")
                    .notEmpty()
                    .bail()
                    .isString()
                    .bail()
                    .isLength({ max: 19, min: 17 }),
                body("emoji", "Must provide a valid emoji id.")
                    .notEmpty()
                    .bail()
                    .isString()
                    .bail()
                    .isLength({ max: 19, min: 17 }),
                body("title", "Must provide a title between 1 and 100 chars")
                    .notEmpty()
                    .bail()
                    .isString()
                    .bail()
                    .isLength({ max: 100, min: 1 }),
                body("description", "Must provide a description between 1 and 100 chars")
                    .notEmpty()
                    .bail()
                    .isString()
                    .bail()
                    .isLength({ max: 250, min: 2 }),
                body("winner_count", "Must provide a number of winners for this giveaway.").notEmpty().toInt(),
                body("expiration_date", "Must provide an expiration date for this giveaway.")
                    .notEmpty()
                    .bail()
                    .isString()
                    .toDate(),
            ),
            async (req: Request, res: Response) => {
                const {
                    channel_id,
                    title,
                    description,
                    emoji,
                    creator_id,
                    winner_count,
                    expiration_date,
                }: {
                    channel_id: string;
                    title: string;
                    description: string;
                    emoji: string;
                    creator_id: string;
                    winner_count: number;
                    expiration_date: Date;
                } = req.body;

                if (
                    expiration_date.getTime() < Date.now() ||
                    expiration_date.getTime() < Date.now() + req.app.bot_client.giveaways.scheduler.checkRate * 1000
                )
                    return res.json({
                        error: {
                            message: `Please provide a date that isn't in the past or isn't in the next ${req.app.bot_client.giveaways.scheduler.checkRate} seconds.`,
                        },
                    });

                const { id: guild_id } = req.params;
                try {
                    const creator = await req.app.bot_client.users.fetch(creator_id).catch(() => null);
                    if (!creator)
                        return res.json({
                            error: {
                                message: "A user with that creator id doesn't exist.",
                            },
                        });
                    const guild = req.app.bot_client.guilds.cache.get(guild_id);
                    if (!guild)
                        return res.json({
                            error: {
                                message: "The bot is not in that guild.",
                            },
                        });
                    const channel = guild.channels.cache.get(channel_id);
                    if (!channel)
                        return res.json({
                            error: {
                                message: "The bot does not have access to a channel with that ID.",
                            },
                        });
                    const guild_emoji = req.app.bot_client.emojis.cache.get(emoji);
                    if (!guild_emoji)
                        return res.json({
                            error: {
                                message: "The bot doesn't have access to a server with that emoji",
                            },
                        });

                    const created_giveaway = await req.app.bot_client.giveaways.create({
                        channel: channel as TextChannel,
                        guild,
                        creator,
                        title,
                        description,
                        expiration_date,
                        emoji: guild_emoji,
                        winner_count,
                    });

                    return res.status(200).json({
                        giveaway: {
                            creator_id,
                            guild_id,
                            channel_id,
                            message_id: created_giveaway.id,
                            title,
                            description,
                            expiration_date,
                            id: created_giveaway.giveaway_id,
                        },
                    });
                } catch (e) {
                    throw e;
                }
            },
        );

    router
        .route("/giveaways/:giveaway_id")
        .get(async (req, res) => {
            const { id: guild_id, giveaway_id } = req.params;
            const giveaway = await req.app.bot_client.db
                .api("giveaways")
                .where({
                    guild_id,
                    id: giveaway_id,
                })
                .first();

            return res.json({
                giveaway,
            });
        })
        .delete(async (req, res) => {
            const { id, giveaway_id } = req.params;
            await req.app.bot_client.giveaways.delete(id, giveaway_id);
            return res.status(200).json({
                message: "Giveaway scheduled for cancelation",
            });
        });

    router.post("/giveaways/:giveaway_id/end", async (req, res) => {
        const { giveaway_id, id } = req.params;
        try {
            const giveaway = await req.app.bot_client.giveaways.end(id, giveaway_id);
            return res.json({
                giveaway,
            });
        } catch (e) {
            return res.status(404).json({
                error: {
                    message: "A giveaway with that ID doesn't exist.",
                },
            });
        }
    });

    return router;
};
