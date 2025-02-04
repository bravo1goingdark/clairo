import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { ValidateVideo } from "../utils/middleware/ValidateVideo.js";
import { uploadCounter } from "../monitoring/monitorCounter.js";
import s3Client from "../utils/s3.js";
import { Upload } from "@aws-sdk/lib-storage";
import s3EventConsumer from "../kafka/consumer.js";
const prisma = new PrismaClient();
const upload = multer();
const videoRouter = Router();
videoRouter.post("/upload/:userID", upload.single("video"), ValidateVideo, uploadCounter, async (request, response) => {
    try {
        const { userID } = request.params;
        const { originalname, buffer, mimetype } = request.file;
        const uniqS3Key = `raw/${new Date().toISOString()}-${originalname}`;
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_S3_UN_PROCESSED_BUCKET,
                Key: uniqS3Key,
                Body: buffer,
                ContentType: mimetype,
            },
        });
        upload.on("httpUploadProgress", (progress) => {
            if (progress.loaded && progress.total) {
                const percentage = ((progress.loaded / progress.total) * 100).toFixed(2);
                response.write(`data: ${JSON.stringify({ progress: percentage })}\n\n`);
            }
        });
        await upload.done();
        const resolutions = ["480p", "720p", "1080p"];
        const resKeys = resolutions.map(res => `${uniqS3Key.split(".")[0]}_${res}.mp4`);
        await prisma.video.create({
            data: {
                s3UnprocessedKey: uniqS3Key,
                resolutions: JSON.stringify(resolutions),
                s3Key: JSON.stringify(resKeys),
                User: {
                    connect: {
                        id: parseInt(userID),
                    },
                },
            },
        });
        response.write(`event: complete\ndata: ${JSON.stringify({ msg: "Video uploaded successfully" })}\n\n`);
        await s3EventConsumer();
        response.status(201).end();
    }
    catch (error) {
        console.error("Video upload error:", error);
        response.status(400).json({
            msg: "Video upload error",
        });
    }
    finally {
        await prisma.$disconnect();
    }
});
export default videoRouter;
