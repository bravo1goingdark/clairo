import "dotenv/config";
import {s3EventConsumer} from "./kafkaContainer.js";


(async (): Promise<void> => {
    try {
        console.log("Starting S3 event consumer...");
        await s3EventConsumer();
    } catch (err) {
        console.error("Error running Kafka consumer:", err);
    }
})();
