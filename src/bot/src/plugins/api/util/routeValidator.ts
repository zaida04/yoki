import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function routeValidator(...validations: any[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req).formatWith(({ msg, param, value }) => {
            return {
                code: "INVALID_INPUT",
                param,
                message: msg,
                value: value ?? null,
            };
        });
        if (errors.isEmpty()) {
            return next();
        }
        const error = errors.array();
        return res.status(400).json({
            errors: error,
        });
    };
}
