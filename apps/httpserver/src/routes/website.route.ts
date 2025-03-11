import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addWebsite, getSignedUrlWebsiteIcon, getWebsite, getWebsiteWithId } from '../controllers/website.controller';

const router = Router();

router.route("/add").post(authMiddleware, addWebsite);

router.route("/").get(authMiddleware, getWebsite);

router.route("/:id").get(authMiddleware, getWebsiteWithId);

router.route('/get-signed-url/website-icon').post(authMiddleware, getSignedUrlWebsiteIcon);

export const websiteRouter = router;