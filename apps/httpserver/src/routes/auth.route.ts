import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { SigninSchema, SignupSchema } from  '../types';
import { prisma } from 'db';
import { JWT_SECRET } from '../config';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router()

router.post('/signup', async (req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SignupSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: 'Invalid Input'});
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

        await prisma.user.create({
            data: {
                ...parsedData.data
            }
        })

        res.status(200).json({message: "User registered successfully!"})

    } catch (error) {
        console.log("Error on signup",error);
        res.status(500).json({message : 'Something went wrong'});   
    }
})

router.post('/signin', async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SigninSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: 'Invalid Input'});
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
        console.log("Error on signin",error);
        res.status(500).json({message : 'Something went wrong'}); 
    }
})


export const authRouter = router;