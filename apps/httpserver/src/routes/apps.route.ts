import { Request, Response, Router } from 'express';
import { AddWebsiteSchema } from '../types';
import { prisma } from 'db';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/add', authMiddleware , async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = AddWebsiteSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: "Invalid Input"})
            return;
        }

        const app = await prisma.website.create({
            data: {
                ...parsedData.data
            }
        })
        res.status(200).json(app);
    } catch (error) {
        console.log("Error occured add app", error);
    }
})


router.get('/', authMiddleware , async (req: Request , res: Response) => {
    try {
        const apps = await prisma.website.findMany();
        res.status(200).json(apps);
    } catch (error) {
        console.log("Error occured add app", error);
    }
})

export const appsRouter = router;