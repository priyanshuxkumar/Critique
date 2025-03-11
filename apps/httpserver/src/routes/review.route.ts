import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addReview, getReviewsOfWebsite, getSignedUrlOfReview } from '../controllers/review.controller';

const router = Router();

router.route('/create/:id').post(authMiddleware, addReview);

router.route('/:id').get(authMiddleware, getReviewsOfWebsite);

router.route('/get-signed-url').post(authMiddleware, getSignedUrlOfReview);

export const reviewRouter = router;