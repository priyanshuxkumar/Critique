import { Request, Response } from 'express';
import { prisma } from 'db';

const upvoteReview = async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    const userId = req.id as number;
    try {
        await prisma.reviewUpvote.create({
            data: {
                reviewId,
                userId,
            }
        })
        res.status(200).json({message: "Review upvote successfully!"})
    } catch (error: any) {
        if(error.code == 'P2002'){
            res.status(409).json({message : "You already upvote this review"})
            return
        }
        res.status(500).json({message : "Something went wrong!"});
    }
}

export { upvoteReview }