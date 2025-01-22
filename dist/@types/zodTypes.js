import zod from "zod";
export const UserSchema = zod.object({
    username: zod.string()
        .min(5, { message: 'userName is required & must be of least 5 characters' })
        .max(20, { message: "userName must be at max 12 character" }),
    password: zod.string().min(8, { message: 'password must be at least 8 characters' }),
    email: zod.string().email({ message: 'email is required && must be valid' }),
});
export const videoMimeTypeSchema = zod.string().refine((mimetype) => {
    const allowedMimeTypes = [
        'video/mp4',
        'video/mpeg',
        'video/ogg',
        'video/webm',
        'video/x-matroska', // for MKV
        'video/quicktime', // for MOV
    ];
    return allowedMimeTypes.includes(mimetype);
}, { message: 'Invalid video file type' });
