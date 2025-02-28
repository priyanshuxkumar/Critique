import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import 'dotenv/config';

import { authRouter } from './routes/auth.route';


const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/auth', authRouter);

app.listen(PORT , () => {
    console.log(`HTTP Server is running on PORT ${PORT}`)
})