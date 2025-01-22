import { ZodError } from "zod";
export const ValidateRequestBody = (schema) => (request, response, next) => {
    try {
        schema.parse(request.body);
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            console.log(error);
            response.status(400).json({
                msg: error.issues.map(issue => issue.message)
            });
        }
        else {
            next(error);
        }
    }
};
export default ValidateRequestBody;
