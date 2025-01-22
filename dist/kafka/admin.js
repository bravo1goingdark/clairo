import kafka from "./client.js";
const initKafkaAdmin = async () => {
    const admin = kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();
    if (!existingTopics.includes("s3-upload-event")) {
        await admin.createTopics({
            topics: [{
                    topic: "s3-upload-event",
                    numPartitions: 1
                }]
        });
        console.log("Topic created: s3-upload-event");
    }
    else {
        console.log("Topic already exists: s3-upload-event");
    }
    await admin.disconnect();
};
initKafkaAdmin().catch(console.error);
