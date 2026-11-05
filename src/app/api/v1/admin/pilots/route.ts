import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/admin";

export async function GET(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || "";
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (region) where.region = region;
    if (status) where.status = status;

    const pilots = await prisma.pilot.findMany({
      where,
      orderBy: { startDate: "desc" },
      include: {
        challenge: {
          include: {
            problem: {
              include: { category: true, owner: { include: { profile: true } } },
            },
          },
        },
        solution: {
          include: {
            solver: { include: { profile: true } },
          },
        },
        metrics: true,
        impact: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: pilots,
    });
  } catch (error: any) {
    console.error("Admin pilots GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Pilot loyihalarni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const {
      challengeId,
      solutionId,
      region = "Farg'ona",
      budget = 0,
      responsiblePerson,
      expectedResult,
      metrics = [],
    } = body;

    if (!challengeId || !solutionId) {
      return NextResponse.json(
        { success: false, error: "Challenge va Yechim ID si talab qilinadi" },
        { status: 400 }
      );
    }

    const newPilot = await prisma.pilot.create({
      data: {
        challengeId,
        solutionId,
        region,
        budget: Number(budget),
        responsiblePerson,
        status: "RUNNING",
        expectedResult,
        metrics: {
          create: metrics.map((m: any) => ({
            metricName: m.metricName,
            expectedValue: String(m.expectedValue),
            actualValue: String(m.actualValue || "0"),
            unit: m.unit || "",
          })),
        },
      },
      include: {
        metrics: true,
      },
    });

    // Update solution and problem status
    await prisma.solution.update({
      where: { id: solutionId },
      data: { status: "PILOT" },
    });

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (challenge) {
      await prisma.problem.update({
        where: { id: challenge.problemId },
        data: { status: "PILOT" },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "ADMIN_PILOT_LAUNCHED",
        entityName: "Pilot",
        entityId: newPilot.id,
        details: JSON.stringify({ challengeId, solutionId, region, budget }),
      },
    });

    return NextResponse.json({
      success: true,
      data: newPilot,
      message: "Pilot loyiha muvaffaqiyatli ishga tushirildi",
    });
  } catch (error: any) {
    console.error("Admin pilot POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Pilot loyiha yaratishda xatolik" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { id, status, actualResult, impactTotal, impactSummary, metricUpdates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Pilot ID si ko'rsatilmadi" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (actualResult) updateData.actualResult = actualResult;

    const updated = await prisma.pilot.update({
      where: { id },
      data: updateData,
    });

    // Handle impact score
    if (impactTotal !== undefined) {
      await prisma.impactScore.upsert({
        where: { pilotId: id },
        update: {
          totalScore: Number(impactTotal),
          summary: impactSummary || null,
        },
        create: {
          pilotId: id,
          totalScore: Number(impactTotal),
          summary: impactSummary || null,
        },
      });
    }

    // Handle metric updates
    if (Array.isArray(metricUpdates)) {
      for (const m of metricUpdates) {
        if (m.id) {
          await prisma.pilotMetric.update({
            where: { id: m.id },
            data: {
              actualValue: String(m.actualValue),
              verifiedByExpertId: auth.user.id,
            },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "ADMIN_PILOT_UPDATED",
        entityName: "Pilot",
        entityId: id,
        details: JSON.stringify(body),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Pilot loyiha yangilandi",
    });
  } catch (error: any) {
    console.error("Admin pilot PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Pilot loyihani yangilashda xatolik" },
      { status: 500 }
    );
  }
}
