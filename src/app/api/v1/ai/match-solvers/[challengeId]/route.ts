import { NextResponse } from "next/server";
import { getAIService } from "@/ai/ai.factory";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { challengeId: string } }
) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: params.challengeId },
      include: { problem: true },
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge topilmadi" },
        { status: 404 }
      );
    }

    // Fetch active Solvers from database with full profile and possible solution
    const solverUsers = await prisma.user.findMany({
      where: {
        userRoles: {
          some: {
            role: {
              name: "SOLVER",
            },
          },
        },
      },
      include: {
        profile: true,
        solutions: {
          where: {
            challengeId: params.challengeId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            estimatedCost: true,
            estimatedDays: true,
            scoreAvg: true,
            createdAt: true,
          },
        },
      },
    });

    const solversData = solverUsers.map((u) => {
      let skills: string[] = [];
      try {
        skills = JSON.parse(u.profile?.skills || "[]");
      } catch {
        skills = [];
      }

      let portfolioUrls: string[] = [];
      try {
        portfolioUrls = JSON.parse(u.profile?.portfolioUrls || "[]");
      } catch {
        portfolioUrls = [];
      }

      let badges: string[] = [];
      try {
        badges = JSON.parse(u.profile?.badges || "[]");
      } catch {
        badges = [];
      }

      return {
        id: u.id,
        email: u.email,
        phone: u.phone,
        name: `${u.profile?.firstName || ""} ${u.profile?.lastName || ""}`.trim() || "Noma'lum mutaxassis",
        skills,
        region: u.profile?.region || "Farg'ona",
        bio: u.profile?.bio || undefined,
        profile: {
          id: u.profile?.id,
          firstName: u.profile?.firstName || "",
          lastName: u.profile?.lastName || "",
          username: u.profile?.username || "",
          avatarUrl: u.profile?.avatarUrl,
          bio: u.profile?.bio,
          region: u.profile?.region || "Farg'ona",
          organizationName: u.profile?.organizationName,
          occupation: u.profile?.occupation,
          skills,
          experienceYears: u.profile?.experienceYears || 0,
          portfolioUrls,
          website: u.profile?.website,
          ratingAvg: u.profile?.ratingAvg || 5.0,
          solvedCount: u.profile?.solvedCount || 0,
          impactTotal: u.profile?.impactTotal || 0,
          badges,
        },
        submittedSolution: u.solutions && u.solutions.length > 0 ? u.solutions[0] : null,
      };
    });

    const aiService = getAIService();
    const matches = await aiService.matchSolvers(
      {
        structuredTitle: challenge.structuredTitle,
        suggestedSkills: JSON.parse(challenge.suggestedSkills),
        region: challenge.problem.region,
      },
      solversData
    );

    const solversMap = new Map(solversData.map((s) => [s.id, s]));

    const enrichedMatches = matches.map((m) => {
      const solverInfo = solversMap.get(m.solverId);
      return {
        ...m,
        profile: solverInfo?.profile || null,
        email: solverInfo?.email || null,
        phone: solverInfo?.phone || null,
        submittedSolution: solverInfo?.submittedSolution || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedMatches,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Solverlarni moslashtirishda xatolik" },
      { status: 400 }
    );
  }
}
