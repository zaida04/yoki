import routeValidator from "../util/routeValidator";
import { Response, Request, NextFunction, Router } from "express";
import { body } from "express-validator";

export default () => {
    const router = Router({ mergeParams: true });

    router
        .route("/settings")
        .get(async (req: Request, res: Response, next: NextFunction) => {
            try {
                const settings = await req.app.bot_client.db.api("settings").where("guild", req.params.id).first();
                if (!settings)
                    return res.status(404).json({
                        error: {
                            message: "A guild with that ID doesn't exist in the db",
                        },
                    });

                const {
                    premium,
                    guild,
                    prefix,
                    joinedDate,
                    muteRole,
                    joinRoles,
                    suggestionChannel,
                    logChannel,
                    modLogChannel,
                    memberLog,
                    welcomeChannel,
                    ticketCategory,
                    suggestionMessage,
                    welcomeMessage,
                    leaveMessage,
                    messageFilterEnabled,
                    autoModEnabled,
                } = settings;

                return res.status(200).json({
                    premium,
                    guild,
                    prefix,
                    joinedDate,
                    muteRole,
                    joinRoles,
                    suggestionChannel,
                    logChannel,
                    modLogChannel,
                    memberLog,
                    welcomeChannel,
                    ticketCategory,
                    suggestionMessage,
                    welcomeMessage,
                    leaveMessage,
                    messageFilterEnabled,
                    autoModEnabled,
                });
            } catch (e) {
                return next(e);
            }
        })
        .patch(
            routeValidator(
                body("prefix", "Must be a string under 6 characters")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 6 })
                    .trim(),
                body("messageFilter", "Must be a boolean representing enabling or disabling").optional().isString(),
                body("logChannel", "Must provide a valid channel id for log channel")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 19, min: 17 }),
                body("modLogChannel", "Must provide a valid channel id for log channel")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 19, min: 17 }),
                body("ticketCategory", "Must provide a valid channel id for ticket category")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 19, min: 17 }),
                body("welcomeChannel", "Must provide a valid channel id for welcome notifications")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 19, min: 17 }),
                body("welcomeMessage", "Must provide a message for welcome channel")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 55, min: 1 }),
                body("leaveMessage", "Must provide a message for welcome channel")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 55, min: 1 }),
                body("welcomeRole", "Must provide a valid role id for welcomeRole")
                    .optional({ checkFalsy: true })
                    .isString()
                    .isLength({ max: 19, min: 17 }),
            ),
            async (req: Request, res: Response, next: NextFunction) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const change_data: any = {};

                change_data.logChannel = req.body.logChannel ?? undefined;
                change_data.ticketCategory = req.body.ticketCategory ?? undefined;
                change_data.modLogChannel = req.body.modLogChannel ?? undefined;
                change_data.prefix = req.body.prefix ?? undefined;
                change_data.welcomeChannel = req.body.welcomeChannel ?? undefined;
                change_data.welcomeRole = req.body.welcomeRole ?? undefined;
                change_data.welcomeMessage = req.body.welcomeChannelMessage ?? undefined;
                change_data.leaveMessage = req.body.leaveMessage ?? undefined;
                change_data.memberLog = req.body.memberLog ?? undefined;
                change_data.muteRole = req.body.muteRole ?? undefined;
                change_data.messageFilter =
                    req.body.messageFilter === "true" ? true : req.body.messageFilter === "false" ? false : undefined;

                try {
                    if (!Object.keys(change_data).length)
                        return res.status(400).json({
                            error: {
                                message: "You must provide data to change.",
                            },
                        });
                    await req.app.bot_client.db.api("settings").where("guild", req.params.id).update(change_data);
                    return res.json({
                        guild: change_data,
                    });
                } catch (e) {
                    return next(e);
                }
            },
        );

    router.post(
        "/settings/reset",
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const deleted = await req.app.bot_client.db.api("settings").where("guild", req.params.id).delete();

                if (!deleted) {
                    return res.status(404).json({
                        error: {
                            message: "A guild with this id doesn't exist in our database.",
                        },
                    });
                }

                await req.app.bot_client.db.api("settings").insert({
                    guild: req.params.id,
                    left: false,
                });
                return res.json({
                    message: "Successfully reset this servers settings",
                });
            } catch (e) {
                return next(e);
            }
        },
    );

    return router;
};
