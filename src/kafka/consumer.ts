import kafka from "./client.js";
import {Consumer, EachMessagePayload} from "kafkajs";
import s3Client from "../utils/s3";


const consumer: Consumer = kafka.consumer({groupId: "transcoder-group"});

const s3EventConsumer: () => Promise<void> = async (): Promise<void> => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: "s3-upload-event",
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({message}: EachMessagePayload): Promise<void> => {
                const {bucket, key} = JSON.parse(message.value?.toString() || "{}");


            }
        })
    } catch (error) {
        await consumer.disconnect();
        console.error(error)
    }

}