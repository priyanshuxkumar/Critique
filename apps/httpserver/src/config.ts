import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

/** JWT Config */
const JWT_SECRET = process.env.JWT_SECRET || "";

// Aws S3 Config
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

/** Frontend Url */
const FRONTEND_URL = process.env.NODE_ENV == "development" && process.env.FRONTEND_URL;

export { JWT_SECRET, s3Client, FRONTEND_URL };
