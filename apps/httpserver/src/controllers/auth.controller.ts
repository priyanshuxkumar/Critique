import { Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SigninSchema, SignupSchema } from  '../types';
import { Prisma, prisma, User } from '@repo/db';
import { config, cookieOptions } from '../config';
import { redisClient }  from "@repo/redisclient";
import { ZodError } from 'zod';

const registerUser = async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SignupSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: parsedData.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }

        const user : User | null = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        });
        if(user){
            res.status(409).json({message: 'User already exists with this email'})
            return;
        }

        const hashPassword = await bcrypt.hash(parsedData.data.password, 10);

        await prisma.user.create({
            data: {
                ...parsedData.data,
                password: hashPassword
            }
        })

        /** Push the email to redis queue to send verification email  */
        try {
            redisClient.rPush('email_verification_queue', parsedData.data.email);
        } catch (error) {
            res.status(500).json({message: "Failed to send verification email"});
            return;
        }

        res.status(200).json({message: "Check your inbox for verification email!"})
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(409).json({message: "User already exists with this email"});
            return;
        }
        if(error instanceof ZodError) {
            res.status(400).json({message: error.errors[0]?.message || "Invalid input"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : 'Something went wrong'});   
    }
}

const loginUser = async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SigninSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: parsedData.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }
        const user : User | null = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })

        if(!user){
            res.status(404).json({message : 'Invalid credentials'});
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(parsedData.data.password , user.password)
        if(!isPasswordCorrect){
            res.status(403).json({mesasge: 'Invalid crendentials'});
            return;
        }

        const a_token = jwt.sign({id: user.id}, config.jwtSecret, {expiresIn: '24h'})
        const r_Token = jwt.sign({id: user.id}, config.jwtRefreshSecret, {expiresIn: '7d'});

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: r_Token
            }
        })

        res.cookie('_token_', a_token, cookieOptions);
        res.cookie('_r_token', r_Token, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });

        res.status(200).json({message: 'Signin successfull!'})
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json({message: "User not found"});
            return;
        }
        if(error instanceof ZodError) {
            res.status(400).json({message: error.errors[0]?.message || "Invalid input"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : 'Something went wrong'}); 
    }
}

const getUser = async(req: Request , res: Response) =>  {
    const userId = req.id as number;
    try {
        const user : User | null = await prisma.user.findFirst({
            where : {
                id : userId
            }
        })
        res.status(200).json({
                id: user?.id,
                name : user?.name,
                avatar: user?.avatar
            }
        )
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json({message: "User not found"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : 'Something went wrong'}); 
    }
}

const logoutUser = async(req: Request , res: Response) =>  {
    const userId = req.id as number;
    const refreshToken = req.cookies._r_token;
    try {
        if (!refreshToken) {
            res.clearCookie("_token_");
            res.clearCookie("_r_token");
            res.status(200).json({ message: "Logout successfull" });
            return;
        }
        
        const user : Pick<User, "id" | "refreshToken"> | null = await prisma.user.findUnique({
            where: {
                id : userId
            },
            select : {
                id : true,
                refreshToken : true
            }
        })
            
        if(!user) {
            res.clearCookie("_token_");
            res.clearCookie("_r_token");
            res.status(404).json({message: "User not found"});
            return;
        }

        if(user.refreshToken !== refreshToken) {
            res.clearCookie("_token_");
            res.clearCookie("_r_token");
            res.status(401).json({message: "Unauthorized"});
            return;
        }
  
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null
            }
        })

        res.clearCookie("_token_");
        res.clearCookie("_r_token");
        
        res.status(200).json({message: "Logout successfull"});
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json({message: "User not found"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : "Something went wrong"});    
    }
}

const refreshToken = async(req: Request , res: Response) => {
    try {
        const rToken = req.cookies._r_token;
        if(!rToken) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        const decoded = jwt.verify(rToken, config.jwtRefreshSecret) as { id: number };

        const user : Pick<User, "id" | "refreshToken"> | null = await prisma.user.findFirst({
            where: {
                id: decoded.id
            },
            select : {
                id: true,
                refreshToken: true
            }
        })

        if(!user || user.refreshToken !== rToken) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        const newAccessToken = jwt.sign({id: user.id}, config.jwtSecret, {expiresIn: '24h'})
        res.cookie('_token_', newAccessToken, cookieOptions);

        res.status(200).json({message: 'Token refreshed successfully'});
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json({message: "User not found"});
            return;
        }
        if(error instanceof JsonWebTokenError) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : 'Something went wrong'});    
    }
}

export { registerUser, loginUser, getUser, logoutUser, refreshToken }