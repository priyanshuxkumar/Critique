import { Resend } from "resend";
import "dotenv/config";

/** JWT Config */
const JWT_SECRET = process.env.JWT_SECRET || "";

/** Email Config */
const resend = new Resend(process.env.RESEND_API_KEY!);

/** Frontend Url */
const FRONTEND_URL = process.env.NODE_ENV == "development" && process.env.FRONTEND_URL;

/** Server Url */ 
const SERVER_URL = process.env.NODE_ENV == "development" && process.env.SERVER_URL;

/** Email Config */ 
const EMAIL_FROM = process.env.EMAIL_FROM;

export { JWT_SECRET, resend, FRONTEND_URL, SERVER_URL, EMAIL_FROM };
