import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(2, "Ismingiz kamida 2 belgidan iborat bo'lishi kerak"),
  lastName: z.string().min(2, "Familiyangiz kamida 2 belgidan iborat bo'lishi kerak"),
  username: z.string().min(3, "Username kamida 3 belgidan iborat bo'lishi kerak")
    .regex(/^[a-zA-Z0-9_]+$/, "Username faqat harf, raqam va underscore (_) dan iborat bo'lishi kerak"),
  email: z.string().email("Yaroqli email manzilini kiriting"),
  phone: z.string().optional(),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  roles: z.array(z.string()).min(1, "Kamida bitta rol tanlang"),
  organizationName: z.string().optional(),
  region: z.string().default("Farg'ona"),
});

export const LoginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email yoki username kiriting"),
  password: z.string().min(1, "Parolni kiriting"),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  bio: z.string().optional(),
  region: z.string().optional(),
  organizationName: z.string().optional(),
  occupation: z.string().optional(),
  skills: z.array(z.string()).optional(),
  website: z.string().url().or(z.literal("")).optional(),
  portfolioUrls: z.array(z.string()).optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
