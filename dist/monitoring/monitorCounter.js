import { Counter } from "prom-client";
let httpReqCounter = new Counter({
    name: "number_of_http_request",
    help: "Total number of http requests",
    labelNames: ["routes", "methods", "statusCode"]
});
let uploadVideoCounter = new Counter({
    name: "number_of_video_uploaded",
    help: "Total number of video uploaded",
    labelNames: ["routes", "methods", "statusCode", "videoUploadStatus"]
});
let noOfUserCounter = new Counter({
    name: "number_of_user_registered",
    help: "Total number of user registered",
    labelNames: ["routes", "methods", "statusCode"]
});
export const requestCounter = (request, response, next) => {
    response.on("finish", () => {
        httpReqCounter.inc({
            routes: request.route?.path,
            methods: request.method,
            statusCode: response.statusCode
        });
    });
    next();
};
export const uploadCounter = (request, response, next) => {
    response.on("finish", () => {
        uploadVideoCounter.inc({
            routes: request.route?.path,
            methods: request.method,
            statusCode: response.statusCode,
            videoUploadStatus: response.statusCode == 201 ? "uploaded" : "failed"
        });
    });
    next();
};
export const noUserCounter = (request, response, next) => {
    response.on("finish", () => {
        noOfUserCounter.inc({
            routes: request.route?.path,
            methods: request.method,
            statusCode: response.statusCode
        });
    });
    next();
};
