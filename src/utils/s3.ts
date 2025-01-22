import {S3Client , PutObjectCommand} from "@aws-sdk/client-s3"
import "dotenv/config.js"

const s3Client : S3Client = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId : process.env.AWS_ACCESS_KEY || " ",
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY || " "
    }
});

const uploadToS3 = async () => {


}

export default  s3Client;