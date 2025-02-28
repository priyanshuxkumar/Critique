import z from 'zod'

export const EmailSchema = z.string().email('Invalid Email format'); 

export const SignupSchema = z.object({
    name: z.string(),
    email : EmailSchema,
    password: z.string().min(8),
})

export const SigninSchema = z.object({
    email: EmailSchema,
    password: z.string().min(8),
})

export const AddWebsiteSchema = z.object({
    name: z.string(),
    websiteUrl: z.string(),
    iconUrl: z.string()
})