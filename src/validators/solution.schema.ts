import { z } from "zod";

export const CreateSolutionSchema = z.object({
  challengeId: z.string().min(1, "Challenge ID ko'rsatilmadi"),
  title: z.string().min(5, "Yechim sarlavhasi kamida 5 belgidan iborat bo'lishi kerak"),
  description: z.string().min(20, "Yechim tavsifi kamida 20 belgidan iborat bo'lishi kerak"),
  technicalApproach: z.string().min(20, "Texnik yondashuv kamida 20 belgidan iborat bo'lishi kerak"),
  expectedResult: z.string().optional(),
  estimatedCost: z.number().min(0, "Moliya narxi manfiy bo'lishi mumkin emas").default(0),
  estimatedDays: z.number().min(1, "Taxminiy muddat kamida 1 kun bo'lishi kerak").default(30),
  teamMembers: z.array(z.string()).optional(),
  githubUrl: z.string().url().or(z.literal("")).optional(),
  demoUrl: z.string().url().or(z.literal("")).optional(),
  riskAnalysis: z.string().optional(),
});

export const ExpertReviewSchema = z.object({
  solutionId: z.string().min(1, "Yechim ID si ko'rsatilmadi"),
  innovationScore: z.number().min(1).max(10),
  feasibilityScore: z.number().min(1).max(10),
  costEfficiencyScore: z.number().min(1).max(10),
  impactScore: z.number().min(1).max(10),
  scalabilityScore: z.number().min(1).max(10),
  technicalQualityScore: z.number().min(1).max(10),
  implementationTimeScore: z.number().min(1).max(10),
  securityScore: z.number().min(1).max(10),
  socialImpactScore: z.number().min(1).max(10),
  comments: z.string().optional(),
});

export const ShortlistSchema = z.object({
  challengeId: z.string().min(1),
  solutionId: z.string().min(1),
  rankPosition: z.number().min(1).default(1),
  shortlistReason: z.string().optional(),
});

export type CreateSolutionInput = z.infer<typeof CreateSolutionSchema>;
export type ExpertReviewInput = z.infer<typeof ExpertReviewSchema>;
export type ShortlistInput = z.infer<typeof ShortlistSchema>;
