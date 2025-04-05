import { Request, Response } from 'express';
import { AddWebsiteSchema, GetSignedUrlOfWebsiteIconSchema } from '../types';
import { Prisma, prisma, Website } from 'db';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config, s3Client } from '../config';
import { checkIsWebsiteExist } from '../helper/website';
import { ZodError } from 'zod';

const addWebsite = async (req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = AddWebsiteSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: parsedData.error.issues[0].message ?? "Invalid Input"})
            return;
        }

        let isWebsiteExist;
        try {
            isWebsiteExist = await checkIsWebsiteExist(parsedData.data.websiteUrl);
            const website = await prisma.website.findFirst({
                where : {
                    websiteUrl : parsedData.data.websiteUrl
                }
            })

            if(website) {
                res.status(409).json({message : "This Url website already exists"});
                return;
            }

        } catch (error : any) {
            res.status(500).json({ message: error.message ?? "Error verifying website. Please try again later." });
            return;
        }
  
        if(!isWebsiteExist) {
            res.status(404).json({message : "Website not found!. Enter valid website URL"});
            return;
        }

        const website : Website = await prisma.website.create({
            data: {
                ...parsedData.data
            }
        })
        res.status(200).json(website);
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(409).json({message : "Website already exists"});
            return;
        }
        if(error instanceof ZodError) {
            res.status(400).json({message: error.errors[0]?.message || "Invalid input"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message : error.message});
            return;
        }
        res.status(500).json({message : "Something went wrong"})
    }
}

const getWebsite = async (req: Request, res: Response) => {
  try {
    const websites: (Website & { _count: { reviews: number } })[] =
      await prisma.website.findMany({
        include: {
          _count: {
            select: { reviews: true },
          },
        },
      });
    websites.sort((a, b) => b._count.reviews - a._count.reviews);
    res.status(200).json(websites);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getWebsiteWithId = async (req: Request , res: Response) => {
    const websiteId = req.params.id; 
    try {
        const data : Website | null = await prisma.website.findFirst({
            where : {
                id : websiteId
            }
        })
        res.status(200).json(data);
    } catch (error : unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : "Something went wrong"})
    }
}

const getSignedUrlWebsiteIcon = async (req: Request , res: Response) => {
    const userId = req.id;
    try {
        const body = req.body;
        const parsedData = GetSignedUrlOfWebsiteIconSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: parsedData.error.issues[0].message ?? "Invalid Input"});
            return;
        }

        const allowedImageType = ["jpg" , "jpeg" , "png"];
        const fileExtension = parsedData.data.imageType.split('.').pop()?.toLocaleLowerCase();
        
        if(!fileExtension || !allowedImageType.includes(fileExtension)){
            res.status(400).json({message: 'Invalid image type'})
            return;
        }

        const putObjectCommand = new PutObjectCommand({
            Bucket: config.s3BucketName,
            Key: `upload/website/icon/${userId}/-${Date.now()}/${parsedData.data.imageName}`
        });

        const signedUrl = await getSignedUrl(s3Client, putObjectCommand);

        res.status(200).json(signedUrl);
    } catch (error : unknown) {
        if(error instanceof ZodError) {
            res.status(400).json({message: error.errors[0]?.message || "Invalid input"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message: 'Something went wrong!'});
    }
}


export { addWebsite, getWebsite, getWebsiteWithId, getSignedUrlWebsiteIcon }