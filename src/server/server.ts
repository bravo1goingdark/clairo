import express, {Express, Request, Response} from "express";
import client from "prom-client";
import "dotenv/config.js"
import {requestCounter} from "../monitoring/monitorCounter.js";
import cors from "cors";
import userRouter from "../routers/userRouter.js";
import videoRouter from "../routers/videoRouter.js";

client.collectDefaultMetrics({
    eventLoopMonitoringPrecision : 10000
})

const PORT: number = Number(process.env.PORT) || 4000;
const app: Express = express();
app.use(cors());
app.use(express.json());

app.use(requestCounter);
app.use(userRouter);
app.use(videoRouter);

app.get("/metrics", async (_request: Request, response: Response): Promise<void> => {
    try {
        const metrics: string = await client.register.metrics();
        response.set("Content-Type", client.register.contentType);
        response.status(200).send(metrics);
    }catch (e) {
        response.status(500).send("Error gathering metrics");
    }
})

app.listen(PORT, (): void => console.log(`Server started on port ${PORT}`));
