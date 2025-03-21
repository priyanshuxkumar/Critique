import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Prisma, prisma, User } from 'db';
import { redisClient }  from "redisclient";

const verifyEmail = async(req: Request , res: Response) => {
    try {
        const { token } = req.query;

        if(!token || typeof token !== "string") {
            res.status(400).json({message : "Invalid request"})
            return;
        }

        const decoded = jwt.verify(token as string, config.jwtSecret);
        if(typeof decoded === "string" || !decoded.email) {
            res.status(400).json({message : "Invalid request"})
            return;
        }

        const user : User | null = await prisma.user.findFirst({
            where : {
                email : decoded.email
            }
        })
        if(!user) {
            res.status(404).json({ message: 'User not found. Please signup again' });
            return;
        }

        await prisma.user.update({
            where: {
                email: decoded.email
            },
            data: {
                emailVerified: true
            }
        })

        /** Send welcome email to user */
        try {
            redisClient.rPush('user_welcome_email_queue', JSON.stringify({
                email: user.email,
                name: user.name
            }));
        } catch (error) {
            res.status(500).json({ message: "Failed to send welcome email" });
            return;
        }

        res.status(200).json({message: "Email verified successfully"});
    } catch (error : unknown) {
        if(error instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ message: "User not found. Please signup again" });
                return;
            }
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export { verifyEmail }