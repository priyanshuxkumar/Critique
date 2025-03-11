import { Request, Response } from 'express';
import { AddWebsiteSchema, GetSignedUrlOfWebsiteIcon } from '../types';
import { prisma } from 'db';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config';

const addWebsite = async (req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = AddWebsiteSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: "Invalid Input"})
            return;
        }

        const app = await prisma.website.create({
            data: {
                ...parsedData.data
            }
        })
        res.status(200).json(app);
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
    }
}

const getWebsite = async (req: Request , res: Response) => {
    try {
        const apps = await prisma.website.findMany();
        res.status(200).json(apps);
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
    }
}


const getWebsiteWithId = async (req: Request , res: Response) => {
    const websiteId = req.params.id; 
    try {
        const data = await prisma.website.findFirst({
            where : {
                id : websiteId
            }
        })
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
    }
}

const getSignedUrlWebsiteIcon = async (req: Request , res: Response) => {
    const userId = req.id;
    try {
        const body = req.body;
        console.log(body)
        const parsedData = GetSignedUrlOfWebsiteIcon.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: 'Invalid Input'});
            return;
        }
        const allowesImageType = ["jpg , jpeg , png"];
        if(!allowesImageType){
            res.status(400).json({message: 'Invalid image type'})
            return;
        }
        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME || "",
            Key: `upload/website/icon/${userId}/-${Date.now()}/${parsedData.data.imageName}`
        });
        const signedUrl = await getSignedUrl(s3Client, putObjectCommand);
        res.status(200).json(signedUrl);
    } catch (error) {
        res.status(500).json({message: 'Something went wrong!'});
    }
}


export { addWebsite,getWebsite, getWebsiteWithId, getSignedUrlWebsiteIcon }