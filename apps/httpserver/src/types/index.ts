import z from 'zod'

export const EmailSchema = z.string().email('Invalid Email format'); 
export const PasswordSchema = z.string().min(8, { message: 'Enter minimum 8 characters password' });

export const SignupSchema = z.object({
    name: z.string(),
    email : EmailSchema,
    password: PasswordSchema,
})

export const SigninSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
})

export const AddWebsiteSchema = z.object({
    name: z.string(),
    websiteUrl: z.string().url('Enter valid website url'),
    iconUrl: z.string().optional(),
    description: z.string().min(20 , {message: 'Enter minimum 20 characters description'}),
})

export const CreateReviewSchema = z.object({
    content : z.string(),
    rating: z.number()
})

export const GetSignedUrlOfWebsiteIconSchema = z.object({
    imageName: z.string(),
    imageType: z.string()
})

export const GetSignedUrlOfReviewSchema = z.object({
    videoName: z.string(),
})