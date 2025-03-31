import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();


const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  s3AccessKey: process.env.S3_ACCESS_KEY || "",
  s3SecretKey: process.env.S3_SECRET_KEY || "",
  s3Region: process.env.S3_REGION,
  s3BucketName: process.env.S3_BUCKET_NAME || ""
}

// Aws S3 Config
const s3Client = new S3Client({
  region: config.s3Region,
  credentials: {
    accessKeyId: config.s3AccessKey,
    secretAccessKey: config.s3SecretKey
  },
});

const cookieOptions = {
  httpOnly : true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24,
  sameSite: 'strict' as 'strict',
  path: '/'
}

export { s3Client, cookieOptions, config };
