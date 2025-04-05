import { Request, Response } from "express";
import { prisma } from "db";
import { calculateLeaderboard } from "../helper/leaderboard";

const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const result = await prisma.website.findMany({
      include: {
        reviews: {
          include: {
            upvotes: true,
          },
        },
      },
    });
    const data = calculateLeaderboard(result);

    const leaderboard = data.sort(
      (a: any, b: any) => b.rankingScore - a.rankingScore
    );

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
  }
};

export { getLeaderboard };
