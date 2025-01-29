import {PutObjectCommand} from "@aws-sdk/client-s3";
import s3Client from "./s3.js";

export const uploadVideo = async (S3InputVideo :{bucket: string, key: string, body: Buffer, fileType: string}) : Promise<void> => {
    try {
        await s3Client.send(new PutObjectCommand({
            Bucket : S3InputVideo.bucket,
            Key : S3InputVideo.key,
            Body : S3InputVideo.body,
            ContentType : S3InputVideo.fileType
        }));
    }catch (error){
        console.error(error);
        throw error;
    }

}