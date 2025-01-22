import kafka from "./client.js";
const consumer = kafka.consumer({ groupId: "transcoder-group" });
const s3EventConsumer = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: "s3-upload-event",
            fromBeginning: true
        });
        await consumer.run({
            eachMessage: async ({ message }) => {
                const { bucket, key } = JSON.parse(message.value?.toString() || "{}");
            }
        });
    }
    catch (error) {
        await consumer.disconnect();
        console.error(error);
    }
};
