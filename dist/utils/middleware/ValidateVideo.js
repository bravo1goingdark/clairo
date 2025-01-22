import { videoMimeTypeSchema } from "../../@types/zodTypes.js";
export const ValidateVideo = (req, res, next) => {
    if (!req.file) {
        res.status(400).json({ msg: 'No file uploaded' });
        return;
    }
    const { mimetype } = req.file;
    const validation = videoMimeTypeSchema.safeParse(mimetype);
    if (!validation.success) {
        res.status(400).json({ msg: validation.error.errors[0].message });
        return;
    }
    next();
};
