import { Router } from 'express';
import { verifyEmail } from '../controllers/email.controller';

const router = Router()

router.route("/verify-email").get(verifyEmail);

export const emailRouter = router;