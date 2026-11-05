import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";

export class AdminService {
  /**
   * Boshqaruv paneli uchun to'liq statistik ma'lumotlar
   */
  static async getDashboardStats() {
    const [
      totalUsers,
      totalProblems,
      pendingProblems,
      publishedProblems,
      pilotProblems,
      solvedProblems,
      totalSolutions,
      shortlistedSolutions,
      totalPilots,
      runningPilots,
      completedPilots,
      categoriesCount,
      recentProblems,
      recentSolutions,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.problem.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.problem.count({ where: { status: "PUBLISHED" } }),
      prisma.problem.count({ where: { status: "PILOT" } }),
      prisma.problem.count({ where: { status: "SOLVED" } }),
      prisma.solution.count(),
      prisma.solution.count({ where: { status: { in: ["SHORTLISTED", "SELECTED", "PILOT"] } } }),
      prisma.pilot.count(),
      prisma.pilot.count({ where: { status: "RUNNING" } }),
      prisma.pilot.count({ where: { status: "COMPLETED" } }),
      prisma.problemCategory.count(),
      prisma.problem.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          owner: {
            include: { profile: true },
          },
          challenge: true,
        },
      }),
      prisma.solution.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          solver: {
            include: { profile: true },
          },
          challenge: {
            include: { problem: true },
          },
        },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            include: { profile: true },
          },
        },
      }),
    ]);

    const budgetAgg = await prisma.problem.aggregate({
      _sum: { budget: true },
    });

    const allProblemsForRegion = await prisma.problem.findMany({
      select: { region: true },
    });
    const regionMap: Record<string, number> = {};
    for (const p of allProblemsForRegion) {
      regionMap[p.region] = (regionMap[p.region] || 0) + 1;
    }

    return {
      counts: {
        users: totalUsers,
        problems: totalProblems,
        pendingProblems,
        publishedProblems,
        pilotProblems,
        solvedProblems,
        solutions: totalSolutions,
        shortlistedSolutions,
        pilots: totalPilots,
        runningPilots,
        completedPilots,
        categories: categoriesCount,
        totalBudget: budgetAgg._sum.budget || 0,
      },
      regions: regionMap,
      recentProblems,
      recentSolutions,
      recentLogs,
    };
  }

  /**
   * Muammolar ro'yxatini filtrlash va paginatsiya bilan olish
   */
  static async getProblems(params: {
    search?: string;
    status?: string;
    region?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }) {
    const { search = "", status = "", region = "", categoryId = "", page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { rawDescription: { contains: search } },
        { organization: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (region) where.region = region;
    if (categoryId) where.categoryId = categoryId;

    const [total, problems] = await Promise.all([
      prisma.problem.count({ where }),
      prisma.problem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          owner: {
            include: { profile: true },
          },
          challenge: {
            include: {
              _count: {
                select: { solutions: true },
              },
            },
          },
        },
      }),
    ]);

    return {
      problems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Foydalanuvchilarni olish va ularning statistikasi
   */
  static async getUsers(params: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { search = "", role = "", status = "", page = 1, limit = 25 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { phone: { contains: search } },
        { profile: { firstName: { contains: search } } },
        { profile: { lastName: { contains: search } } },
        { profile: { username: { contains: search } } },
      ];
    }
    if (role) {
      where.userRoles = {
        some: {
          role: { name: role },
        },
      };
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          profile: true,
          userRoles: {
            include: { role: true },
          },
          _count: {
            select: {
              problems: true,
              solutions: true,
              expertReviews: true,
            },
          },
        },
      }),
    ]);

    const formattedUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      phone: u.phone,
      isVerified: u.isVerified,
      status: u.status,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role.name),
      profile: u.profile
        ? {
            ...u.profile,
            skills: safeJsonParse<string[]>(u.profile.skills, []),
            portfolioUrls: safeJsonParse<string[]>(u.profile.portfolioUrls, []),
            socialLinks: safeJsonParse<Record<string, string>>(u.profile.socialLinks, {}),
            badges: safeJsonParse<string[]>(u.profile.badges, []),
          }
        : null,
      stats: {
        problemsCount: u._count.problems,
        solutionsCount: u._count.solutions,
        reviewsCount: u._count.expertReviews,
      },
    }));

    return {
      users: formattedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
