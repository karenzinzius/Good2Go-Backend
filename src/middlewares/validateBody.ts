import type { RequestHandler } from "express";
import { z, type ZodObject } from "zod/v4";
// written weird because it has to return another fn, then destructuring
const validateBody = (zodSchema: ZodObject): RequestHandler => (req, res, next) => {
    const {data, error, success} = zodSchema.safeParse(req.body);

    if (!success) {
        next(new Error(z.prettifyError(error), { cause: 400 }))
    } else {
        req.body = data;
        next();
    }
};
export default validateBody