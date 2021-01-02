import { Router } from "express";

export default () => {
    const router = Router({ mergeParams: true });

    /* router
        .route("/guilds/:id/giveaways")
        .post(routeValidator(), async (req: Request, res: Response, next: NextFunction) => {})
        .get(async (req: Request, res: Response, next: NextFunction) => {});*/
    return router;
};
