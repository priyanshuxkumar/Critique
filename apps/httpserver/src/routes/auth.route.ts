import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerUser , loginUser, getUser, logoutUser } from '../controllers/auth.controller';

const router = Router()

router.route("/signup").post(registerUser);

router.route("/signin").post(loginUser);

router.route("/").get(authMiddleware, getUser);

router.route("/logout").post(logoutUser);

export const authRouter = router;