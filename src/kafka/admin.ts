import kafka from "./client.js";
import { Admin } from "kafkajs";

const initKafkaAdmin : () => Promise<void> = async (): Promise<void> => {
    const admin: Admin = kafka.admin();
    await admin.connect();

    const existingTopics : string[] = await admin.listTopics();
    if (!existingTopics.includes("s3-upload-event")) {
        await admin.createTopics({
            topics: [{
                topic: "s3-upload-event",
                numPartitions: 1
            }]
        });
        console.log("Topic created: s3-upload-event");
    } else {
        console.log("Topic already exists: s3-upload-event");
    }

    await admin.disconnect();
}

initKafkaAdmin().catch(console.error);
