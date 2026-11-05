import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/admin";

export async function GET(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { technicalApproach: { contains: search } },
      ];
    }

    const [total, solutions] = await Promise.all([
      prisma.solution.count({ where }),
      prisma.solution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          solver: {
            include: { profile: true },
          },
          challenge: {
            include: {
              problem: {
                include: { category: true },
              },
            },
          },
          reviews: {
            include: {
              expert: { include: { profile: true } },
            },
          },
          pilots: true,
        },
      }),
    ]);

    const formatted = solutions.map((sol) => ({
      ...sol,
      teamMembers: JSON.parse(sol.teamMembers || "[]"),
    }));

    return NextResponse.json({
      success: true,
      data: {
        solutions: formatted,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Admin solutions GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Yechimlarni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { id, status, scoreAvg } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Yechim ID si ko'rsatilmadi" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (scoreAvg !== undefined) updateData.scoreAvg = Number(scoreAvg);

    const updated = await prisma.solution.update({
      where: { id },
      data: updateData,
      include: {
        solver: { include: { profile: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "ADMIN_SOLUTION_STATUS_CHANGED",
        entityName: "Solution",
        entityId: id,
        details: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Yechim holati yangilandi",
    });
  } catch (error: any) {
    console.error("Admin solution PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Yechimni yangilashda xatolik" },
      { status: 500 }
    );
  }
}
