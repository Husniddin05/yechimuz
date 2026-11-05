import { z } from "zod";

export const CreateProblemSchema = z.object({
  title: z.string().min(5, "Muammo sarlavhasi kamida 5 ta belgidan iborat bo'lishi kerak"),
  rawDescription: z.string().min(20, "Muammo tavsifi kamida 20 ta belgidan iborant bo'lishi kerak"),
  categoryId: z.string().min(1, "Muammo kategoriyasini tanlang"),
  region: z.string().default("Farg'ona"),
  organization: z.string().optional(),
  problemType: z.enum(["GENERAL", "TECHNICAL", "AGRICULTURAL", "WATER", "ECOLOGY"]).default("GENERAL"),
  severityLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  targetResult: z.string().optional(),
  budget: z.number().min(0, "Byudjet manfiy bo'lishi mumkin emas").default(0),
  currency: z.string().default("UZS"),
  deadline: z.string().optional(), // ISO date string
  attachments: z.array(z.string()).optional(),
});

export const FilterProblemSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  region: z.string().optional(),
  problemType: z.string().optional(),
  severityLevel: z.string().optional(),
  status: z.string().optional(),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  sortBy: z.enum(["newest", "highest_reward", "deadline"]).default("newest").optional(),
  page: z.number().default(1).optional(),
  limit: z.number().default(10).optional(),
});

export const UpdateProblemStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "PENDING_REVIEW",
    "PUBLISHED",
    "CHALLENGE_READY",
    "IN_PROGRESS",
    "PILOT",
    "SOLVED",
    "CLOSED",
  ], {
    errorMap: () => ({ message: "Noto'g'ri status formati kiritildi" }),
  }),
});

export type CreateProblemInput = z.infer<typeof CreateProblemSchema>;
export type FilterProblemInput = z.input<typeof FilterProblemSchema>;
export type UpdateProblemStatusInput = z.infer<typeof UpdateProblemStatusSchema>;
