import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SigninSchema, SignupSchema } from  '../types';
import { prisma } from 'db';
import { JWT_SECRET } from '../config';

const registerUser = async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SignupSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: parsedData.error.issues[0].message ?? "Invalid Input"});
            return;
        }
        const user = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })

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
        res.status(200).json({message: "User registered successfully!"})
    } catch (error) {
        res.status(500).json({message : 'Something went wrong'});   
    }
}

const loginUser = async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SigninSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: parsedData.error.issues[0].message ?? "Invalid Input"});
            return;
        }
        const user = await prisma.user.findFirst({
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

        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '24h'})
        const options = {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'strict' as 'strict',
            path: '/'
        }

        res.cookie('_token_',token, options);
        res.status(200).json({message: 'Signin successfull!'})
    } catch (error) {
        res.status(500).json({message : 'Something went wrong'}); 
    }
}

const getUser = async(req: Request , res: Response) =>  {
    const userId = req.id as number;
    try {
        const user = await prisma.user.findFirst({
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
    } catch (error) {
        res.status(500).json({message : 'Something went wrong'}); 
    }
}

const logoutUser = async(req: Request , res: Response) =>  {
    try {
        res.clearCookie('_token_', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        })
        res.status(200).json({message: 'logout successfully'});
    } catch (error) {
        res.status(500).json({message : 'Something went wrong'});    
    }
}

export { registerUser, loginUser, getUser, logoutUser }