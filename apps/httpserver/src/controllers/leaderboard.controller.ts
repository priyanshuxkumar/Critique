import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { calculateLeaderboard } from "../helper/leaderboard";

const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await prisma.website.findMany({
      where: {
        reviews: {
          some: {
            OR: [
              {
                createdAt: {
                  gte: oneWeekAgo,
                },
              },
              {
                upvotes: {
                  some: {
                    createdAt: {
                      gte: oneWeekAgo,
                    },
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        reviews: {
          include: {
            upvotes: true,
          },
        },
      },
    });
    const data = calculateLeaderboard(result);

    const websites = data.sort((a: any, b: any) => b.rankingScore - a.rankingScore).slice(0,10);

    res.status(200).json(
      websites.map((item: any) => ({
        id: item.id, 
        name: item.name,
        websiteUrl: item.websiteUrl,
        iconUrl: item.iconUrl,
        totalReviews: item.totalReviews,
        avgRating: item.avgRating,
        totalReviewsUpvotes: item.totalReviewsUpvotes,
        rankingScore: item.rankingScore,
        isVerified: item.isVerified,
        category: item.category,
      }))
    );
  } catch (error) {
    if(error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export { getLeaderboard };
