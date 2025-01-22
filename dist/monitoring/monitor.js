import { Counter } from "prom-client";
let httpReqCounter = new Counter({
    name: "number_of_http_request",
    help: "Total number of http requests",
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
