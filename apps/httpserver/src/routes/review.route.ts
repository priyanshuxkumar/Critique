import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addReview, getReviewsOfWebsite } from '../controllers/review.controller';

const router = Router();

router.route('/create/:id').post(authMiddleware, addReview);

router.route('/:id').get(authMiddleware, getReviewsOfWebsite);

export const reviewRouter = router;