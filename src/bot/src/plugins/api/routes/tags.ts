import routeValidator from "../util/routeValidator";
import { Response, Request, NextFunction, Router } from "express";
import { body } from "express-validator";

export default () => {
    const router = Router({ mergeParams: true });

    router
        .route("/tags")
        .get(async (req: Request, res: Response, next: NextFunction) => {
            try {
                const tags = await req.app.bot_client.db.api("tags").where("guild_id", req.params.id);
                return res.status(200).json({
                    tags: tags,
                });
            } catch (e) {
                return next(e);
            }
        })
        .post(
            routeValidator(
                body("tag_name", "Tag name must be one word under 40 characters.")
                    .notEmpty()
                    .isString()
                    .custom((val) => val.split(" ").length < 2)
                    .isLength({ max: 40 })
                    .trim(),
                body("tag_body").notEmpty().isString().isLength({ max: 100 }).trim().stripLow().escape(),
            ),
            async (req: Request, res: Response, next: NextFunction) => {
                const { tag_name, tag_body } = req.body;
                try {
                    if (
                        await req.app.bot_client.db
                            .api("tags")
                            .where({
                                guild_id: req.params.id,
                                name: tag_name,
                            })
                            .first()
                    ) {
                        return res.status(409).json({
                            error: true,
                            response: "Resource already exists.",
                        });
                    }

                    await req.app.bot_client.db.api("tags").insert({
                        content: tag_body,
                        guild_id: req.params.id,
                        name: tag_name,
                    });

                    return res.status(200).json({
                        tag: {
                            name: tag_name,
                            body: tag_body,
                        },
                    });
                } catch (e) {
                    return next(e);
                }
            },
        )
        .delete(
            routeValidator(
                body("tag_name", "Tag name must be one word under 40 characters.")
                    .notEmpty()
                    .isString()
                    .custom((val) => val.split(" ").length < 2)
                    .isLength({ max: 40 })
                    .trim(),
            ),
            async (req: Request, res: Response, next: NextFunction) => {
                const { tag_name } = req.body;
                try {
                    await req.app.bot_client.db
                        .api("tags")
                        .where({
                            guild_id: req.params.id,
                            name: tag_name,
                        })
                        .delete();
                    return res.status(202).json({
                        message: "Resource scheduled for deletion if exists.",
                    });
                } catch (e) {
                    return next(e);
                }
            },
        );
    return router;
};
