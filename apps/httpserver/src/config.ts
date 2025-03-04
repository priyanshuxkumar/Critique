import { S3Client } from "@aws-sdk/client-s3";

export const JWT_SECRET = process.env.JWT_SECRET || '';

export const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || ""
    }
});

