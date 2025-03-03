import z from 'zod'

export const EmailSchema = z.string().email('Invalid Email format'); 
export const PasswordSchema = z.string().min(8, { message: 'Enter minimum 8 character password' });

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
    websiteUrl: z.string(),
    iconUrl: z.string(),
    description: z.string(),
})

export const CreateReviewSchema = z.object({
    content : z.string(),
    rating: z.number()
})