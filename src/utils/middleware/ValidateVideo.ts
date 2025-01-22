import {videoMimeTypeSchema} from "../../@types/zodTypes.js";
import {Request, Response, NextFunction} from "express";
import {ResponseSkeleteon} from "../../@types/user.js";



export const ValidateVideo = (req: Request, res: Response<ResponseSkeleteon>, next: NextFunction) : void => {
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