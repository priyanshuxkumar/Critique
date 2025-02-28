import { Request, Response, Router } from 'express';
import { CreateReviewSchema } from '../types';
import { prisma } from 'db';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/create/:id', authMiddleware, async (req: Request , res: Response) => {
    const userId = req.id as number;
    const websiteId = req.params.id;
    try {
        const body = req.body;
        const parsedData = CreateReviewSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: "Invalid Input"})
            return;
        }

        const review = await prisma.review.create({
            data: {
                ...parsedData.data,
                userId,
                websiteId
            }
        })
        res.status(200).json(review);
    } catch (error : any) {
        if(error.code == 'P2002'){
            res.status(409).json({ message: "You already submitted on this website"});
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
})


router.get('/:id', authMiddleware, async (req: Request , res: Response) => {
    const websiteId = req.params.id;
    try {
        const reviews = await prisma.review.findMany({
            where: {
                websiteId
            }
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.log("Error occured while fetching reviews", error);
    }
})

export const reviewRouter = router;