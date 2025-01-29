import kafka from "./client.js";
import {Consumer, EachMessagePayload} from "kafkajs";
import {Resolution} from "../@types/resolution";


const consumer: Consumer = kafka.consumer({groupId: "transcoder-group"});

const resolutions : Resolution[] = [
    { width: 1920, height: 1080, label: "1080p" },
    { width: 1280, height: 720, label: "720p" },
    { width: 854, height: 480, label: "480p" },
];

const s3EventConsumer: () => Promise<void> = async (): Promise<void> => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: "s3-upload-event",
            fromBeginning: false // will poll message from current offset
        });

        await consumer.run({
            eachMessage: async ({message}: EachMessagePayload): Promise<void> => {
                const {bucket, key} = JSON.parse(message.value?.toString() || "{}");


            }
        });

    } catch (error) {
        await consumer.disconnect();
        console.error(error)
    }

}