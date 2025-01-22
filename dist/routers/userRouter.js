import { Router } from "express";
import { UserSchema } from "../@types/zodTypes.js";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password.js";
import ValidateRequestBody from "../utils/middleware/zodValidation.js";
import { noUserCounter } from "../monitoring/monitorCounter.js";
const prisma = new PrismaClient();
const userRouter = Router();
userRouter.post("/create-user", noUserCounter, ValidateRequestBody(UserSchema), async (request, response) => {
    const { username, email, password } = request.body;
    try {
        const user = await prisma.$transaction(async (prisma) => {
            const doesUserExist = await prisma.user.findFirst({
                where: {
                    OR: [{ username: username }, { email: email }]
                }
            });
            if (doesUserExist) {
                throw new Error("User already exist");
            }
            return prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashPassword(password)
                },
                omit: {
                    createdAt: true,
                    updatedAt: true,
                    password: true,
                    id: true
                }
            });
        });
        response.status(201).json({
            msg: "User created successfully",
            user: user
        });
        await prisma.$disconnect();
    }
    catch (error) {
        response.status(400).json({
            message: error instanceof Error ? error.message : "Error creating user",
        });
    }
});
export default userRouter;
