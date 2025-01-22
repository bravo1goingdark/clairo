import crypto from "node:crypto";


export const hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return `${hash}:${salt}`;
}

export const doesPasswordMatch = (password: string , storedSaltHash : string) : boolean => {
    const [hash , salt] = storedSaltHash.split(':');
    return  hash == crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}