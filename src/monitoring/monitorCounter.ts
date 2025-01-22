import {Request, Response, NextFunction, RequestHandler} from 'express';
import {Counter} from "prom-client";

let httpReqCounter: Counter<"routes" | "methods" | "statusCode"> = new Counter({
    name: "number_of_http_request",
    help: "Total number of http requests",
    labelNames: ["routes", "methods", "statusCode"]
})

let uploadVideoCounter: Counter<"routes" | "methods" | "statusCode" | "videoUploadStatus"> = new Counter({
    name: "number_of_video_uploaded",
    help: "Total number of video uploaded",
    labelNames: ["routes", "methods", "statusCode", "videoUploadStatus"]
})
let noOfUserCounter: Counter<"routes" | "methods" | "statusCode"> = new Counter({
    name: "number_of_user_registered",
    help: "Total number of user registered",
    labelNames: ["routes", "methods", "statusCode"]
})

export const requestCounter: RequestHandler = (request: Request, response: Response, next: NextFunction): void => {
    response.on("finish", (): void => {
        httpReqCounter.inc({
            routes: request.route?.path,
            methods: request.method,
            statusCode: response.statusCode
        })
    })
    next();
}

export const uploadCounter: RequestHandler = (request: Request, response: Response, next: NextFunction): void => {
    response.on("finish", (): void => {
        uploadVideoCounter.inc({
            routes: request.route?.path,
            methods: request.method,
            statusCode: response.statusCode,
            videoUploadStatus: response.statusCode == 201 ? "uploaded" : "failed"
        })
    })
    next();
}

export const noUserCounter: RequestHandler = (request: Request, response: Response, next: NextFunction): void => {
    response.on("finish", (): void => {
        noOfUserCounter.inc({
            routes: request.route?.path,
            methods: request.method,
            statusCode: response.statusCode
        })
    })
    next();
}

