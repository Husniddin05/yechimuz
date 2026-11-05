import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || "";
    const status = searchParams.get("status") || "";

    const where: any = {
      // Faqat tasdiqlangan, amaldagi yoki yakunlangan pilotlar ommaga ko'rsatiladi
      status: { in: ["APPROVED", "RUNNING", "COMPLETED"] },
    };

    if (region && region !== "all") {
      where.region = region;
    }

    if (status && ["APPROVED", "RUNNING", "COMPLETED"].includes(status)) {
      where.status = status;
    }

    const pilots = await prisma.pilot.findMany({
      where,
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        region: true,
        startDate: true,
        endDate: true,
        budget: true,
        status: true,
        expectedResult: true,
        actualResult: true,
        challenge: {
          select: {
            id: true,
            structuredTitle: true,
            formattedObjective: true,
            problem: {
              select: {
                id: true,
                title: true,
                region: true,
                organization: true,
                category: {
                  select: {
                    nameUz: true,
                    slug: true,
                    icon: true,
                  },
                },
              },
            },
          },
        },
        solution: {
          select: {
            id: true,
            title: true,
            scoreAvg: true,
            solver: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    organizationName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        metrics: {
          select: {
            id: true,
            metricName: true,
            expectedValue: true,
            actualValue: true,
            unit: true,
          },
        },
        impact: {
          select: {
            id: true,
            totalScore: true,
            summary: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: pilots,
    });
  } catch (error: any) {
    console.error("Public pilots GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Pilot loyihalarni yuklashda xatolik yuz berdi",
      },
      { status: 500 }
    );
  }
}
