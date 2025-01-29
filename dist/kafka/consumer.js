import kafka from "./client.js";
const consumer = kafka.consumer({ groupId: "transcoder-group" });
const resolutions = [
    { width: 1920, height: 1080, label: "1080p" },
    { width: 1280, height: 720, label: "720p" },
    { width: 854, height: 480, label: "480p" },
];
const s3EventConsumer = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: "s3-upload-event",
            fromBeginning: false // will poll message from current offset
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
