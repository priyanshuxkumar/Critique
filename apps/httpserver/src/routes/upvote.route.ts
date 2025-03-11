import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upvoteReview } from '../controllers/upvote.controller';

const router = Router();

router.route('/:id').post(authMiddleware , upvoteReview);


export const upvoteRouter = router;