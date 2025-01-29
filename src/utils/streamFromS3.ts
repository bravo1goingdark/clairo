import {GetObjectCommand} from "@aws-sdk/client-s3";
import s3Client from "./s3.js";

import {PassThrough} from "stream";


export const streamFromS3: (bucket: string, key: string) => Promise<PassThrough> = async (bucket: string, key: string): Promise<PassThrough> => {
    const {Body} = await s3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: key
    }));

    if (!Body) {
        throw new Error(`Could not find object: ${key}`);
    }
    const passThrough: PassThrough = new PassThrough();
    const readable: ReadableStream = Body as ReadableStream;
    const reader: ReadableStreamDefaultReader = readable.getReader();


    await (async (): Promise<void> => {
        while (true) {
            const {value, done} = await reader.read();
            if (done) {
                passThrough.end();
                break;
            }
            passThrough.write(value);
        }
    })();

    return passThrough;
}