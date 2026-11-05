/**
 * YechimUZ Platform - Markaziy TypeScript Turlari (Types & Interfaces)
 * Ushbu fayl loyihaning barcha qatlamlari uchun yagona tur xavfsizligini ta'minlaydi.
 */

// ==========================================
// 1. Foydalanuvchilar va Rollar (Users & Roles)
// ==========================================

export type UserRoleType =
  | "USER"
  | "SOLVER"
  | "PROBLEM_OWNER"
  | "COMPANY"
  | "STARTUP"
  | "EXPERT"
  | "SPONSOR"
  | "MODERATOR"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface UserProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  region: string;
  organizationName?: string | null;
  occupation?: string | null;
  skills: string[];
  experienceYears: number;
  portfolioUrls: string[];
  website?: string | null;
  socialLinks: Record<string, string>;
  ratingAvg: number;
  solvedCount: number;
  impactTotal: number;
  badges: string[];
}

export interface UserData {
  id: string;
  email: string;
  phone?: string | null;
  isVerified: boolean;
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
  createdAt: string | Date;
  roles: UserRoleType[];
  profile?: UserProfileData | null;
}

// ==========================================
// 2. Muammolar va Kategoriyalar (Problems & Categories)
// ==========================================

export type ProblemStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "CHALLENGE_READY"
  | "IN_PROGRESS"
  | "PILOT"
  | "SOLVED"
  | "CLOSED";

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface CategoryData {
  id: string;
  nameUz: string;
  nameRu?: string | null;
  nameEn?: string | null;
  slug: string;
  icon?: string | null;
  problemsCount?: number;
}

export interface ProblemData {
  id: string;
  ownerId: string;
  categoryId: string;
  title: string;
  rawDescription: string;
  region: string;
  organization?: string | null;
  problemType: string;
  severityLevel: SeverityLevel;
  targetResult?: string | null;
  budget: number;
  currency: string;
  deadline?: string | Date | null;
  status: ProblemStatus;
  attachments: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: CategoryData;
  owner?: {
    id: string;
    email: string;
    profile?: UserProfileData | null;
  };
  challenge?: ChallengeData | null;
}

// ==========================================
// 3. AI Challenge va Moslashtirish (Challenges)
// ==========================================

export interface ChallengeData {
  id: string;
  problemId: string;
  structuredTitle: string;
  formattedObjective: string;
  suggestedSkills: string[];
  targetKPIs: string[];
  challengeFormat: string;
  missingFields: string[];
  generatedQuestions: string[];
  isOwnerApproved: boolean;
  publishedAt: string | Date;
  solutionsCount?: number;
}

// ==========================================
// 4. Yechimlar va Baholash (Solutions & Reviews)
// ==========================================

export type SolutionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "SELECTED"
  | "PILOT"
  | "COMPLETED"
  | "REJECTED";

export interface SolutionData {
  id: string;
  challengeId: string;
  solverId: string;
  title: string;
  description: string;
  technicalApproach: string;
  expectedResult?: string | null;
  estimatedCost: number;
  estimatedDays: number;
  teamMembers: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  riskAnalysis?: string | null;
  status: SolutionStatus;
  scoreAvg: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  solver?: {
    id: string;
    email: string;
    profile?: UserProfileData | null;
  };
  reviews?: ExpertReviewData[];
}

export interface ExpertReviewData {
  id: string;
  solutionId: string;
  expertId: string;
  innovationScore: number;
  feasibilityScore: number;
  costEfficiencyScore: number;
  impactScore: number;
  scalabilityScore: number;
  totalScore: number;
  comments?: string | null;
  createdAt: string | Date;
  expert?: {
    id: string;
    email: string;
    profile?: UserProfileData | null;
  };
}

// ==========================================
// 5. Pilot Sinovlari (Pilots & Metrics)
// ==========================================

export type PilotStatus =
  | "PLANNED"
  | "APPROVED"
  | "RUNNING"
  | "EVALUATION"
  | "COMPLETED"
  | "FAILED";

export interface PilotMetricData {
  id: string;
  pilotId: string;
  metricName: string;
  expectedValue: string;
  actualValue: string;
  unit?: string | null;
  verifiedByExpertId?: string | null;
}

export interface PilotData {
  id: string;
  challengeId: string;
  solutionId: string;
  region: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  budget: number;
  responsiblePerson?: string | null;
  status: PilotStatus;
  expectedResult?: string | null;
  actualResult?: string | null;
  metrics: PilotMetricData[];
  impactScore?: number;
  impactSummary?: string | null;
}

// ==========================================
// 6. API Javob Standartlari (API Responses)
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
