import { prisma } from "@/lib/prisma";
import { CreateProblemInput, FilterProblemInput } from "@/validators/problem.schema";
import { safeJsonParse } from "@/lib/utils";

export class ProblemService {
  static async createProblem(ownerId: string, input: CreateProblemInput) {
    const category = await prisma.problemCategory.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw new Error("Tanlangan kategoriya topilmadi.");
    }

    const problem = await prisma.problem.create({
      data: {
        ownerId,
        categoryId: input.categoryId,
        title: input.title,
        rawDescription: input.rawDescription,
        region: input.region || "Farg'ona",
        organization: input.organization || null,
        problemType: input.problemType || "GENERAL",
        severityLevel: input.severityLevel || "MEDIUM",
        targetResult: input.targetResult || null,
        budget: input.budget || 0,
        currency: input.currency || "UZS",
        deadline: input.deadline ? new Date(input.deadline) : null,
        status: "PUBLISHED", // Published by default for MVP marketplace visibility
        attachments: JSON.stringify(input.attachments || []),
      },
      include: {
        category: true,
        owner: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: ownerId,
        action: "PROBLEM_CREATED",
        entityName: "Problem",
        entityId: problem.id,
        details: JSON.stringify({ title: problem.title, region: problem.region }),
      },
    });

    return {
      ...problem,
      attachments: safeJsonParse<string[]>(problem.attachments, []),
    };
  }

  static async getProblems(filters: FilterProblemInput) {
    const {
      query,
      categoryId,
      region,
      problemType,
      severityLevel,
      status,
      minBudget,
      maxBudget,
      sortBy,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { rawDescription: { contains: query } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (region) where.region = region;
    if (problemType) where.problemType = problemType;
    if (severityLevel) where.severityLevel = severityLevel;
    if (status) {
      where.status = status;
    } else {
      where.status = { in: ["PUBLISHED", "CHALLENGE_READY", "IN_PROGRESS", "PILOT", "SOLVED"] };
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      where.budget = {};
      if (minBudget !== undefined) where.budget.gte = minBudget;
      if (maxBudget !== undefined) where.budget.lte = maxBudget;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "highest_reward") orderBy = { budget: "desc" };
    if (sortBy === "deadline") orderBy = { deadline: "asc" };

    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          owner: {
            include: {
              profile: true,
            },
          },
          challenge: true,
        },
      }),
      prisma.problem.count({ where }),
    ]);

    return {
      data: problems.map((p) => ({
        ...p,
        attachments: safeJsonParse<string[]>(p.attachments, []),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProblemById(id: string) {
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        category: true,
        owner: {
          include: {
            profile: true,
          },
        },
        challenge: {
          include: {
            solutions: {
              include: {
                solver: {
                  include: {
                    profile: true,
                  },
                },
                reviews: {
                  include: {
                    expert: {
                      include: {
                        profile: true,
                      },
                    },
                  },
                },
                attachments: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!problem) {
      throw new Error("Muammo topilmadi.");
    }

    return {
      ...problem,
      attachments: safeJsonParse<string[]>(problem.attachments, []),
      challenge: problem.challenge
        ? {
            ...problem.challenge,
            solutions: problem.challenge.solutions.map((s) => ({
              ...s,
              teamMembers: safeJsonParse<string[]>(s.teamMembers, []),
            })),
          }
        : null,
    };
  }

  static async updateProblemStatus(id: string, status: string, userId: string) {
    const problem = await prisma.problem.findUnique({ where: { id } });
    if (!problem) throw new Error("Muammo topilmadi.");

    // Foydalanuvchi va uning rollarini tekshirish (RBAC & Ownership check)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Foydalanuvchi topilmadi.");
    }

    const isOwner = problem.ownerId === userId;
    const isAdmin = user.userRoles.some((ur) =>
      ["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(ur.role.name)
    );

    if (!isOwner && !isAdmin) {
      throw new Error("Sizda ushbu muammo statusini o'zgartirish vakolati mavjud emas.");
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "PROBLEM_STATUS_UPDATED",
        entityName: "Problem",
        entityId: id,
        details: JSON.stringify({ oldStatus: problem.status, newStatus: status }),
      },
    });

    return updated;
  }

  static async getMyProblems(ownerId: string) {
    const problems = await prisma.problem.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        challenge: {
          include: {
            solutions: {
              include: {
                solver: {
                  include: {
                    profile: true,
                  },
                },
                reviews: {
                  include: {
                    expert: {
                      include: {
                        profile: true,
                      },
                    },
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    return problems.map((p) => ({
      ...p,
      attachments: safeJsonParse<string[]>(p.attachments, []),
      challenge: p.challenge
        ? {
            ...p.challenge,
            suggestedSkills: safeJsonParse<string[]>(p.challenge.suggestedSkills, []),
            targetKPIs: safeJsonParse<string[]>(p.challenge.targetKPIs, []),
            solutions: p.challenge.solutions.map((s) => ({
              ...s,
              teamMembers: safeJsonParse<string[]>(s.teamMembers, []),
            })),
          }
        : null,
    }));
  }

  static async getCategories() {
    return await prisma.problemCategory.findMany({
      orderBy: { nameUz: "asc" },
    });
  }
}
