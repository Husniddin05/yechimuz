import { prisma } from "@/lib/prisma";
import { CreateSolutionInput, ExpertReviewInput, ShortlistInput } from "@/validators/solution.schema";
import { safeJsonParse } from "@/lib/utils";

export class SolutionService {
  static async submitSolution(solverId: string, input: CreateSolutionInput) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: input.challengeId },
      include: { problem: true },
    });

    if (!challenge) {
      throw new Error("Bog'liq Challenge topilmadi.");
    }

    const solution = await prisma.solution.create({
      data: {
        challengeId: input.challengeId,
        solverId,
        title: input.title,
        description: input.description,
        technicalApproach: input.technicalApproach,
        expectedResult: input.expectedResult || null,
        estimatedCost: input.estimatedCost || 0,
        estimatedDays: input.estimatedDays || 30,
        teamMembers: JSON.stringify(input.teamMembers || []),
        githubUrl: input.githubUrl || null,
        demoUrl: input.demoUrl || null,
        riskAnalysis: input.riskAnalysis || null,
        status: "SUBMITTED",
      },
      include: {
        solver: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Notify Problem Owner
    await prisma.notification.create({
      data: {
        userId: challenge.problem.ownerId,
        title: "Yangi Yechim Yuborildi!",
        message: `"${challenge.problem.title}" muammosiga yangi yechim taklifi kelib tushdi.`,
        type: "SOLUTION_SUBMITTED",
        linkUrl: `/problems/${challenge.problemId}`,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: solverId,
        action: "SOLUTION_SUBMITTED",
        entityName: "Solution",
        entityId: solution.id,
      },
    });

    return {
      ...solution,
      teamMembers: safeJsonParse<string[]>(solution.teamMembers, []),
    };
  }

  static async getSolutionsForProblem(problemId: string) {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { challenge: true },
    });

    if (!problem || !problem.challenge) {
      return [];
    }

    const solutions = await prisma.solution.findMany({
      where: { challengeId: problem.challenge.id },
      orderBy: { scoreAvg: "desc" },
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
        shortlists: true,
      },
    });

    return solutions.map((s) => ({
      ...s,
      teamMembers: safeJsonParse<string[]>(s.teamMembers, []),
    }));
  }

  static async getSolutionById(id: string) {
    const solution = await prisma.solution.findUnique({
      where: { id },
      include: {
        challenge: {
          include: {
            problem: true,
          },
        },
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
    });

    if (!solution) throw new Error("Yechim topilmadi.");

    return {
      ...solution,
      teamMembers: safeJsonParse<string[]>(solution.teamMembers, []),
    };
  }

  static async submitExpertReview(expertId: string, input: ExpertReviewInput) {
    const solution = await prisma.solution.findUnique({
      where: { id: input.solutionId },
    });

    if (!solution) throw new Error("Baholanadigan yechim topilmadi.");

    // Calculate 9 criteria total score average (1.0 to 10.0 scale)
    const sumScores =
      input.innovationScore +
      input.feasibilityScore +
      input.costEfficiencyScore +
      input.impactScore +
      input.scalabilityScore +
      input.technicalQualityScore +
      input.implementationTimeScore +
      input.securityScore +
      input.socialImpactScore;

    const totalScore = Number((sumScores / 9).toFixed(2));

    const review = await prisma.expertReview.create({
      data: {
        solutionId: input.solutionId,
        expertId,
        innovationScore: input.innovationScore,
        feasibilityScore: input.feasibilityScore,
        costEfficiencyScore: input.costEfficiencyScore,
        impactScore: input.impactScore,
        scalabilityScore: input.scalabilityScore,
        comments: input.comments || null,
        totalScore,
      },
    });

    // Update solution average score
    const allReviews = await prisma.expertReview.findMany({
      where: { solutionId: input.solutionId },
    });

    const newAvg = Number(
      (allReviews.reduce((acc, r) => acc + r.totalScore, 0) / allReviews.length).toFixed(2)
    );

    await prisma.solution.update({
      where: { id: input.solutionId },
      data: {
        scoreAvg: newAvg,
        status: "UNDER_REVIEW",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: expertId,
        action: "EXPERT_REVIEW_SUBMITTED",
        entityName: "ExpertReview",
        entityId: review.id,
        details: JSON.stringify({ totalScore, solutionId: input.solutionId }),
      },
    });

    return review;
  }

  static async shortlistSolution(userId: string, input: ShortlistInput) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: input.challengeId },
      include: { problem: true },
    });

    if (!challenge) {
      throw new Error("Bog'liq Challenge topilmadi.");
    }

    // Foydalanuvchi va uning rollarini tekshirish (RBAC & Problem Owner check)
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

    const isOwner = challenge.problem.ownerId === userId;
    const isAuthorized =
      isOwner ||
      user.userRoles.some((ur) =>
        ["ADMIN", "SUPER_ADMIN", "EXPERT"].includes(ur.role.name)
      );

    if (!isAuthorized) {
      throw new Error("Sizda ushbu yechimni shortlist qilish vakolati mavjud emas.");
    }

    const shortlist = await prisma.shortlist.create({
      data: {
        challengeId: input.challengeId,
        solutionId: input.solutionId,
        rankPosition: input.rankPosition,
        shortlistReason: input.shortlistReason || null,
        selectedByUserId: userId,
      },
    });

    await prisma.solution.update({
      where: { id: input.solutionId },
      data: { status: "SHORTLISTED" },
    });

    return shortlist;
  }

  static async getMySolutions(solverId: string) {
    const solutions = await prisma.solution.findMany({
      where: { solverId },
      orderBy: { createdAt: "desc" },
      include: {
        solver: {
          include: {
            profile: true,
          },
        },
        challenge: {
          include: {
            problem: {
              include: {
                category: true,
                owner: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
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
    });

    return solutions.map((s) => ({
      ...s,
      teamMembers: safeJsonParse<string[]>(s.teamMembers, []),
    }));
  }
}
