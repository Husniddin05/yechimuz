import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";

export interface GetTopSolversOptions {
  region?: string | null;
  limit?: number;
}

export interface SolverRankingItem {
  id: string;
  rank: number;
  name: string;
  username: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  region: string;
  occupation?: string | null;
  organizationName?: string | null;
  skills: string[];
  experienceYears: number;
  ratingAvg: number;
  solvedCount: number;
  impactTotal: number;
  badges: string[];
  solutionsCount: number;
  solutions: {
    id: string;
    title: string;
    status: string;
    scoreAvg: number;
  }[];
}

export class SolverService {
  /**
   * Top reytingli yechimchilarni (Solver) olish va tartiblash
   */
  static async getTopSolvers(options: GetTopSolversOptions = {}): Promise<SolverRankingItem[]> {
    const { region, limit = 10 } = options;

    const where: any = {
      userRoles: {
        some: {
          role: {
            name: "SOLVER",
          },
        },
      },
    };

    if (region && region !== "all") {
      where.profile = {
        region,
      };
    }

    const solvers = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        solutions: {
          select: {
            id: true,
            title: true,
            status: true,
            scoreAvg: true,
          },
        },
      },
      orderBy: [
        {
          profile: {
            ratingAvg: "desc",
          },
        },
        {
          profile: {
            solvedCount: "desc",
          },
        },
      ],
      take: Math.min(limit, 50),
    });

    return solvers.map((s, idx) => {
      const skills = safeJsonParse<string[]>(s.profile?.skills, []);
      const badges = safeJsonParse<string[]>(s.profile?.badges, []);

      return {
        id: s.id,
        rank: idx + 1,
        name: s.profile ? `${s.profile.firstName} ${s.profile.lastName}` : s.email.split("@")[0],
        username: s.profile?.username || s.email.split("@")[0],
        email: s.email,
        phone: s.phone,
        avatarUrl: s.profile?.avatarUrl,
        bio: s.profile?.bio,
        region: s.profile?.region || "Farg'ona",
        occupation: s.profile?.occupation,
        organizationName: s.profile?.organizationName,
        skills,
        experienceYears: s.profile?.experienceYears || 0,
        ratingAvg: s.profile?.ratingAvg || 5.0,
        solvedCount: s.profile?.solvedCount || 0,
        impactTotal: s.profile?.impactTotal || 0,
        badges,
        solutionsCount: s.solutions.length,
        solutions: s.solutions,
      };
    });
  }

  /**
   * Bitta yechimchining to'liq profil ma'lumotlarini olish
   */
  static async getSolverById(userId: string) {
    const solver = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userRoles: { include: { role: true } },
        solutions: {
          include: {
            challenge: { include: { problem: true } },
            reviews: true,
          },
        },
      },
    });

    if (!solver) return null;

    return {
      ...solver,
      profile: solver.profile
        ? {
            ...solver.profile,
            skills: safeJsonParse<string[]>(solver.profile.skills, []),
            badges: safeJsonParse<string[]>(solver.profile.badges, []),
            portfolioUrls: safeJsonParse<string[]>(solver.profile.portfolioUrls, []),
            socialLinks: safeJsonParse<Record<string, string>>(solver.profile.socialLinks, {}),
          }
        : null,
    };
  }
}
