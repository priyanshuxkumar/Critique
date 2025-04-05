export function calculateLeaderboard(websites : any) {
    return websites.map((website : any) => {
        
        const totalReviews = Number(website.reviews.length);
        
        const avgRating = website.reviews.reduce((sum : any, r : any) => sum + r.rating, 0) / (totalReviews);

        const totalReviewsUpvotes = website.reviews.reduce((sum : any, r : any) => sum + r.upvotes.length, 0);

        const rankingScore = avgRating * 2 + totalReviewsUpvotes * 0.5;

        return {
            ...website,
            totalReviews,
            avgRating,
            totalReviewsUpvotes,
            rankingScore
        }

    });
}