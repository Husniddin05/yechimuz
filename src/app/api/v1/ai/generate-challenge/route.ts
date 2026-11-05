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
    const { problemId, title, rawDescription, region } = body;

    let problemData = {
      title,
      rawDescription,
      region,
    };

    if (problemId) {
      const problem = await prisma.problem.findUnique({ where: { id: problemId } });
      if (!problem) {
        return NextResponse.json(
          { success: false, error: "Muammo topilmadi" },
          { status: 404 }
        );
      }

      // Faqatgina muammoni joylagan inson (yoki admin) AI Challenge'ni boshlay oladi
      const isOwner = problem.ownerId === user.userId;
      const isAdmin = user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN");

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          {
            success: false,
            error: "Faqatgina muammoni joylashtirgan muallif AI Challenge'ni boshlashi mumkin!",
          },
          { status: 403 }
        );
      }

      problemData = {
        title: problem.title,
        rawDescription: problem.rawDescription,
        region: problem.region,
      };
    }

    if (!problemData.title || !problemData.rawDescription) {
      return NextResponse.json(
        { success: false, error: "Muammo nomi va tavsifi talab qilinadi" },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const challengeDraft = await aiService.generateChallenge(problemData);

    // If problemId is provided, save Challenge draft into database
    if (problemId) {
      await prisma.challenge.upsert({
        where: { problemId },
        update: {
          structuredTitle: challengeDraft.structuredTitle,
          formattedObjective: challengeDraft.formattedObjective,
          suggestedSkills: JSON.stringify(challengeDraft.suggestedSkills),
          targetKPIs: JSON.stringify(challengeDraft.targetKPIs),
          challengeFormat: challengeDraft.challengeFormat,
          missingFields: JSON.stringify(challengeDraft.missingFields),
          generatedQuestions: JSON.stringify(challengeDraft.generatedQuestions),
        },
        create: {
          problemId,
          structuredTitle: challengeDraft.structuredTitle,
          formattedObjective: challengeDraft.formattedObjective,
          suggestedSkills: JSON.stringify(challengeDraft.suggestedSkills),
          targetKPIs: JSON.stringify(challengeDraft.targetKPIs),
          challengeFormat: challengeDraft.challengeFormat,
          missingFields: JSON.stringify(challengeDraft.missingFields),
          generatedQuestions: JSON.stringify(challengeDraft.generatedQuestions),
          isOwnerApproved: false,
        },
      });

      await prisma.problem.update({
        where: { id: problemId },
        data: { status: "CHALLENGE_READY" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "AI Challenge muvaffaqiyatli shakllantirildi!",
      data: challengeDraft,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "AI Challenge yaratishda xatolik" },
      { status: 400 }
    );
  }
}
