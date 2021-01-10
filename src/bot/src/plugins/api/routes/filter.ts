import routeValidator from "../util/routeValidator";
import { Response, Request, NextFunction, Router } from "express";
import { body } from "express-validator";

export default () => {
    const router = Router({ mergeParams: true });

    router
        .route("/filter")
        .get(async (req: Request, res: Response, next: NextFunction) => {
            try {
                const words = await req.app.bot_client.db.api("messageFilter").where({ guild_id: req.params.id });
                return res.status(200).json({
                    words: words,
                });
            } catch (e) {
                return next(e);
            }
        })
        .post(
            routeValidator(
                body("ban_word", "Must supply a not already added word/phrase to ban under 30 characters.")
                    .notEmpty()
                    .bail()
                    .isString()
                    .bail()
                    .isLength({ max: 30 })
                    .trim(),
            ),
            async (req: Request, res: Response, next: NextFunction) => {
                const { ban_word } = req.body;

                try {
                    if (
                        await req.app.bot_client.db
                            .api("messageFilter")
                            .where({
                                guild_id: req.params.id,
                                content: ban_word,
                            })
                            .first()
                    )
                        return res.json({
                            error: {
                                code: "WORD_EXISTS",
                                message: "That word is already in the filter lol.",
                            },
                        });

                    await req.app.bot_client.db.api("messageFilter").insert({
                        guild_id: req.params.id,
                        content: ban_word,
                    });
                    return res.status(200).json({
                        message: "Successfully added word.",
                    });
                } catch (e) {
                    return next(e);
                }
            },
        )
        .delete(
            routeValidator(
                body("ban_word", "Must supply a word/phrase to unban under 30 characters.")
                    .notEmpty()
                    .bail()
                    .isString()
                    .bail()
                    .isLength({ max: 30 })
                    .trim(),
            ),
            async (req: Request, res: Response, next: NextFunction) => {
                const { ban_word } = req.body;
                try {
                    await req.app.bot_client.db
                        .api("messageFilter")
                        .where({
                            guild_id: req.params.id,
                            content: ban_word,
                        })
                        .delete();
                    return res.status(200).json({
                        message: "Resource successfully deleted.",
                    });
                } catch (e) {
                    return next(e);
                }
            },
        );
    return router;
};
