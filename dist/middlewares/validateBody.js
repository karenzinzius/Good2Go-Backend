import { z } from "zod/v4";
// written weird because it has to return another fn, then destructuring
const validateBody = (zodSchema) => (req, res, next) => {
    const { data, error, success } = zodSchema.safeParse(req.body);
    if (!success) {
        next(new Error(z.prettifyError(error), { cause: 400 }));
    }
    else {
        req.body = data;
        next();
    }
};
export default validateBody;
