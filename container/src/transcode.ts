import {getSignedURL, uploadToS3} from "./s3Container.js";
import ffmpeg, {FfmpegCommand} from "fluent-ffmpeg";
import {PassThrough} from "stream";


interface Resolution {
    width: number;
    height: number;
    label: string;
}

const resolutions: Resolution[] = [
    {width: 1920, height: 1080, label: "1080p"},
    {width: 1280, height: 720, label: "720p"},
    {width: 854, height: 480, label: "480p"},
];



export const transcode: (bucket: string, key: string) => Promise<void> = async (bucket: string, key: string): Promise<void> => {
    try {
        const signedUrl: string = await getSignedURL(bucket, key);

        for (const resolution of resolutions) {
            const {width, height, label} = resolution;

            const ffmpegStream: FfmpegCommand = ffmpeg(signedUrl)
                .size(`${width}x${height}`)
                .videoCodec("libx264")
                .audioCodec("aac")
                .outputFormat("mp4")
                .outputOptions([
                    "-movflags", "frag_keyframe+empty_moov",
                    "-analyzeduration", "100M",
                    "-probesize", "100M",
                ])
                .on("start", (command: string) => {
                    console.log(`Starting transcode for ${command}`);
                })
                .on("progress", (progress) => {
                    console.log(`[${label}] Processing: ${Math.round(progress.percent!)}% done`);
                })
                .on("stderr", (stderrLine: string) => {
                    console.log(`[${label}] FFmpeg stderr:`, stderrLine);
                })
                .on("error", (err: Error) => {
                    console.error(`[${label}] Error during transcoding:`, err);
                });

            const uploadStream = new PassThrough();
            const keyWithResolution = `${key.split(".")[0]}_${label}.mp4`;

            ffmpegStream.pipe(uploadStream);

            await uploadToS3(process.env.AWS_S3_PROCESSED_BUCKET!, keyWithResolution, uploadStream);
            console.log(`Successfully uploaded ${label} resolution video to S3`);
        }
    } catch (err) {
        console.error("Error during transcoding:", err);
    }
};