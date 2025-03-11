import { Request, Response } from 'express';
import { CreateReviewSchema } from '../types';
import { prisma } from 'db';

const addReview = async (req: Request , res: Response) => {
    const userId = req.id as number;
    const websiteId = req.params.id;
    try {
        const body = req.body;
        const parsedData = CreateReviewSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: parsedData.error.issues[0].message ?? "Invalid Input"})
            return;
        }

        const review = await prisma.review.create({
            data: {
                ...parsedData.data,
                userId,
                websiteId
            },
            select: {
                id: true,
                content: true,
                rating: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        avatar: true
                    }
                },
                upvotes: {
                    select: {
                        id: true,
                        userId: true,
                        reviewId: true
                    }
                }
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
}

const getReviewsOfWebsite = async(req: Request , res: Response) => {
    const websiteId = req.params.id;
    try {
        const reviews = await prisma.review.findMany({
            where: {
                websiteId
            },
            include: {
                user: true,
                upvotes: true

            },
        });
        res.status(200).json(
            reviews.map(item => ({
                id: item.id,
                content : item.content,
                rating : item.rating,
                createdAt: item.createdAt,
                user : {
                    name : item.user.name,
                    avatar: item.user.avatar
                },
                upvotes: item.upvotes.map(x => ({
                        id: x.id,
                        userId: x.userId,
                        reviewId: x.reviewId
                    }
                ))
            }))
        );
    } catch (error) {
        res.status(500).json({message : "Something went wrong"});
    }
}

export { addReview , getReviewsOfWebsite }