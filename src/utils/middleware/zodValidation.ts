import {ZodError, ZodSchema} from "zod";
import {Request, Response, NextFunction} from "express";
import {ResponseSkeleteon} from "../../@types/user";

export const ValidateRequestBody = (schema: ZodSchema) => (request: Request, response: Response<ResponseSkeleteon>, next: NextFunction) => {
    try {
        schema.parse(request.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(error)
            response.status(400).json({
                msg : error.issues.map(issue => issue.message)
            });
        } else {
            next(error);
        }
    }
};

export  default ValidateRequestBody;