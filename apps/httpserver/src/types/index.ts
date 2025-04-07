import z from "zod";

export const EmailSchema = z.string().email("Invalid Email format");
export const PasswordSchema = z
  .string()
  .min(8, { message: "Enter minimum 8 characters password" });

export const SignupSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  email: EmailSchema,
  password: PasswordSchema,
});

export const SigninSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const AddWebsiteSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  websiteUrl: z.string().url("Enter valid website url"),
  iconUrl: z.string().optional(),
  description: z.string().min(20, { message: "Enter minimum 20 characters description" }),
  category: z.enum([
    "PRODUCTIVITY",
    "DEV_TOOL",
    "DESIGN",
    "MARKETING",
    "EDUCATION",
    "FINANCE",
    "HEALTH",
    "AI",
    "ECOMMERCE",
    "SOCIAL",
    "ENTERTAINMENT",
    "OTHER",
  ]),
});

export const CreateReviewSchema = z.object({
  content: z.string().trim().nonempty("Content is required"),
  rating: z.number(),
  videoUrl: z.string().url().optional(),
});

export const GetSignedUrlOfWebsiteIconSchema = z.object({
  imageName: z.string().trim().nonempty(),
  imageType: z.string().trim().nonempty(),
});

export const GetSignedUrlOfReviewSchema = z.object({
  videoName: z.string().trim().nonempty(),
});
