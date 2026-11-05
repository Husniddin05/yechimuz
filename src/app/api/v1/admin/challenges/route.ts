import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/admin";

export async function GET(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const [total, challenges] = await Promise.all([
      prisma.challenge.count(),
      prisma.challenge.findMany({
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        include: {
          problem: {
            include: {
              category: true,
              owner: { include: { profile: true } },
            },
          },
          solutions: {
            include: {
              solver: { include: { profile: true } },
            },
          },
          shortlists: true,
          pilots: true,
        },
      }),
    ]);

    const formatted = challenges.map((ch) => ({
      ...ch,
      suggestedSkills: JSON.parse(ch.suggestedSkills || "[]"),
      targetKPIs: JSON.parse(ch.targetKPIs || "[]"),
      missingFields: JSON.parse(ch.missingFields || "[]"),
      generatedQuestions: JSON.parse(ch.generatedQuestions || "[]"),
    }));

    return NextResponse.json({
      success: true,
      data: {
        challenges: formatted,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Challenge'larni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { id, isOwnerApproved, structuredTitle, formattedObjective } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Challenge ID si talab qilinadi" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (isOwnerApproved !== undefined) updateData.isOwnerApproved = Boolean(isOwnerApproved);
    if (structuredTitle) updateData.structuredTitle = structuredTitle;
    if (formattedObjective) updateData.formattedObjective = formattedObjective;

    const updated = await prisma.challenge.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "ADMIN_CHALLENGE_UPDATED",
        entityName: "Challenge",
        entityId: id,
        details: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Challenge muvaffaqiyatli yangilandi",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Challenge'ni yangilashda xatolik" },
      { status: 500 }
    );
  }
}
