import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default function (...validations: any[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req).formatWith(({ msg, param, value }) => {
            return {
                error: {
                    code: "INVALID_INPUT",
                    param,
                    message: msg,
                    value,
                },
            };
        });
        if (errors.isEmpty()) {
            return next();
        }
        const error = errors.mapped();
        return res.json({
            error,
        });
    };
}
