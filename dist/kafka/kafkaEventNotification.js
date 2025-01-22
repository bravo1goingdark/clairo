// this script will run on aws lambda (s3KafkaEvent)
// whenever a video is uploaded to s3 it trigger an event
// and send the required information to kafka topic for consumption & further transcoding purpose
import kafka from "./client.js";
import s3Client from "../utils/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
const producer = kafka.producer();
export const handler = async (event) => {
    const s3event = event.Records[0].s3;
    const bucket = s3event.bucket.name;
    const key = decodeURIComponent(s3event.object.key.replace(/\+/g, " "));
    await producer.connect();
    try {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        await s3Client.send(command);
        await producer.connect();
        await producer.send({
            topic: "s3-upload-event",
            messages: [{
                    value: JSON.stringify({
                        bucket,
                        key,
                        url: `https://${bucket}.s3.amazonaws.com/${key}`,
                        uploadedAt: new Date().toISOString()
                    })
                }]
        });
        await producer.disconnect();
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
