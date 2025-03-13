import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { prisma } from 'db';
import { redisClient }  from "redisclient";

const verifyEmail = async(req: Request , res: Response) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token as string, JWT_SECRET);
        if(typeof decoded === "string" || !decoded.email) {
            res.status(400).json({message : "Invalid request"})
            return;
        }

        const user = await prisma.user.findFirst({
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
        redisClient.rPush('user_welcome_email_queue', JSON.stringify({
            email: user.email,
            name: user.name
        }));

        res.status(200).json({message: "Email verified successfully"});
    } catch (error) {
        console.log(error);   
        res.status(500).json({ message: 'Invalid or expired token' });
    }
}

export { verifyEmail }