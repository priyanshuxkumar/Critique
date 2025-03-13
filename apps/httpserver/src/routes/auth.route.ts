import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerUser , loginUser, getUser, logoutUser, refreshToken } from '../controllers/auth.controller';

const router = Router()

router.route("/signup").post(registerUser);

router.route("/signin").post(loginUser);

router.route("/").get(authMiddleware, getUser);

router.route("/logout").post(authMiddleware, logoutUser);

router.route("/refresh").post(authMiddleware, refreshToken);

export const authRouter = router;