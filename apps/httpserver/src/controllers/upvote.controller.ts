import { Request, Response } from 'express';
import { Prisma, prisma } from '@repo/db';

const upvoteReview = async (req: Request, res: Response) => {
    const userId = req.id as number;
    const reviewId = req.params.id;
    try {
        await prisma.reviewUpvote.create({
            data: {
                reviewId : reviewId as string,
                userId : userId as number,
            }
        })
        res.status(200).json({message: "Review upvote successfully!"})
    } catch (error: unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(409).json({message : "You already upvote this review"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message : error.message});
            return;
        }
        res.status(500).json({message : "Something went wrong!"});
    }
}

export { upvoteReview }