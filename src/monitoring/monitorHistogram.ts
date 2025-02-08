import {Request, Response, NextFunction, RequestHandler} from "express";
import {Histogram, register} from "prom-client";

const latencyHistogram = new Histogram({
    name: "http_request_duration_seconds",
    help: "Histogram of HTTP request latency in seconds",
    labelNames: ["route", "method", "statusCode"],
    buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
});


export const latencyMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const start: [number, number] = process.hrtime();

    res.on("finish", (): void => {
        const duration: [number, number] = process.hrtime(start);
        const durationInSeconds: number = duration[0] + duration[1] / 1e9;

        latencyHistogram.observe({
                route: req.route?.path || req.path,
                method: req.method,
                statusCode: res.statusCode.toString(),
            },
            durationInSeconds
        );
    });

    next();
};

register.registerMetric(latencyHistogram);