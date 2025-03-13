import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import 'dotenv/config';

import { authRouter } from './routes/auth.route';
import { websiteRouter } from './routes/website.route';
import { reviewRouter } from './routes/review.route';
import { upvoteRouter } from './routes/upvote.route';
import { emailRouter } from './routes/email.route';


const PORT = process.env.PORT;
const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    method: ['GET','POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/website', websiteRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/upvote', upvoteRouter);
app.use(emailRouter);

app.listen(PORT , () => {
    console.log(`HTTP Server is running on PORT ${PORT}`)
})