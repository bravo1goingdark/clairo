import { Kafka } from "kafkajs";
import "dotenv/config";
import fs from "node:fs";
const kafka = new Kafka({
    clientId: "clairo-kafka",
    brokers: ["kafka-clairo-ak0704176-bdd5.c.aivencloud.com:16178"],
    sasl: {
        username: process.env.KAFKA_USERNAME || " ",
        password: process.env.KAFKA_PASSWORD || " ",
        mechanism: "scram-sha-256"
    },
    ssl: {
        ca: [fs.readFileSync("C:\\Users\\Ashutosh Kumar\\WebstormProjects\\clairo\\src\\ca.pem", "utf-8")]
    }
});
export default kafka;
