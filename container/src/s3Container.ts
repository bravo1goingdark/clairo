import {S3Client , GetObjectCommand} from "@aws-sdk/client-s3";
import {PassThrough} from "stream";
import {Upload} from "@aws-sdk/lib-storage";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export const uploadToS3: (bucket: string, key: string, body: PassThrough) => Promise<void> = async (bucket: string, key: string, body: PassThrough): Promise<void> => {
    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: "video/mp4",
        },
        partSize: 10 * 1024 * 1024,
    });

    try {
        upload.on("httpUploadProgress", (progress): void => {
            console.log(`Upload Progress: ${progress.loaded} bytes uploaded`);
        });

        await upload.done();
        console.log(`Transcoded video uploaded successfully to ${key}`);
    } catch (error) {
        console.error(`Error uploading ${key}:`, error);
        throw error;
    }
};
export const getSignedURL: (bucket: string, key: string) => Promise<string> = async (bucket: string, key: string): Promise<string> => {
    const getOBJ: GetObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    return await getSignedUrl(s3Client, getOBJ, {expiresIn: 1800});
};