import {Consumer, EachMessagePayload, Kafka} from "kafkajs";
import fs from "fs";
import {transcode} from "./transcode.js";

export const kafka = new Kafka({
    clientId: "clairo-kafka",
    brokers: ["kafka-clairo-ak0704176-bdd5.c.aivencloud.com:16178"],
    sasl: {
        username: process.env.KAFKA_USERNAME || "",
        password: process.env.KAFKA_PASSWORD || "",
        mechanism: "scram-sha-256",
    },
    ssl: {
        ca: [fs.readFileSync("/app/src/ca.pem", "utf-8")],
    },
});

const consumer: Consumer = kafka.consumer({groupId: "transcoder-group"});

export const s3EventConsumer: () => Promise<void> = async (): Promise<void> => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: "s3-upload-event",
            fromBeginning: false,
        });

        await consumer.run({
            eachMessage: async ({message}: EachMessagePayload): Promise<void> => {
                const {bucket, key} = JSON.parse(message.value?.toString() || "{}");
                console.log(`Bucket: ${bucket}, Key: ${key}`);

                if (!bucket || !key) {
                    console.error("Invalid message received:", message.value?.toString());
                    return;
                }

                try {
                    console.log(`Processing video from bucket: ${bucket}, key: ${key}`);
                    await transcode(bucket, key);
                    console.log(`Successfully processed video: ${key}`);
                } catch (err) {
                    console.error("Error processing video:", err);
                }
            },
        });
    } catch (err) {
        console.error("Error setting up Kafka consumer:", err);
        await consumer.disconnect();
    }
};
