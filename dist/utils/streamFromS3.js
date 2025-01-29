import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3.js";
import { PassThrough } from "stream";
export const streamFromS3 = async (bucket, key) => {
    const { Body } = await s3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: key
    }));
    if (!Body) {
        throw new Error(`Could not find object: ${key}`);
    }
    const passThrough = new PassThrough();
    const readable = Body;
    const reader = readable.getReader();
    await (async () => {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                passThrough.end();
                break;
            }
            passThrough.write(value);
        }
    })();
    return passThrough;
};
