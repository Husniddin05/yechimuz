import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { getAIService } from "@/ai/ai.factory";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { solutionId, customData } = body;

    let evaluationInput;
    let fullSolutionData: any = null;

    if (solutionId) {
      const solution = await prisma.solution.findUnique({
        where: { id: solutionId },
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
        },
      });

      if (!solution) {
        return NextResponse.json(
          { success: false, error: "Yechim topilmadi" },
          { status: 404 }
        );
      }

      fullSolutionData = {
        ...solution,
        teamMembers: JSON.parse(solution.teamMembers || "[]"),
      };

      const solverProfile = solution.solver.profile;
      const problem = solution.challenge?.problem;

      let solverSkills: string[] = [];
      try {
        solverSkills = JSON.parse(solverProfile?.skills || "[]");
      } catch {
        solverSkills = [];
      }

      evaluationInput = {
        problemTitle: problem?.title || "Noma'lum muammo",
        problemDescription: problem?.rawDescription || "",
        problemBudget: problem?.budget || 0,
        problemRegion: problem?.region || "Farg'ona",
        problemTargetResult: problem?.targetResult || undefined,
        solutionTitle: solution.title,
        solutionDescription: solution.description,
        technicalApproach: solution.technicalApproach,
        expectedResult: solution.expectedResult || undefined,
        estimatedCost: solution.estimatedCost,
        estimatedDays: solution.estimatedDays,
        riskAnalysis: solution.riskAnalysis || undefined,
        solverName: solverProfile ? `${solverProfile.firstName} ${solverProfile.lastName}` : "Noma'lum solver",
        solverOccupation: solverProfile?.occupation || undefined,
        solverSkills,
        solverRating: solverProfile?.ratingAvg || 5.0,
      };
    } else if (customData) {
      evaluationInput = customData;
    } else {
      return NextResponse.json(
        { success: false, error: "solutionId yoki customData talab qilinadi" },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const evaluation = await aiService.evaluateSolution(evaluationInput);

    return NextResponse.json({
      success: true,
      message: "AI yechim tahlili va tavsiyalari muvaffaqiyatli tayyorlandi",
      data: {
        evaluation,
        solution: fullSolutionData,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Yechimni AI orqali tekshirishda xatolik yuz berdi" },
      { status: 400 }
    );
  }
}
