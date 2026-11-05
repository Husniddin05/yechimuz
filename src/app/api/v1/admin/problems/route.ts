import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/admin";
import { AdminService } from "@/services/admin.service";
import { ApiResponse } from "@/lib/api-response";

export async function GET(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const region = searchParams.get("region") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await AdminService.getProblems({
      search,
      status,
      region,
      categoryId,
      page,
      limit,
    });

    return ApiResponse.success(result);
  } catch (error: any) {
    console.error("Admin problems GET error:", error);
    return ApiResponse.serverError(error);
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { id, status, severityLevel, budget, region, categoryId } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Muammo ID si ko'rsatilmadi" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (severityLevel) updateData.severityLevel = severityLevel;
    if (budget !== undefined) updateData.budget = Number(budget);
    if (region) updateData.region = region;
    if (categoryId) updateData.categoryId = categoryId;

    const updated = await prisma.problem.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        owner: { include: { profile: true } },
      },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "ADMIN_PROBLEM_UPDATED",
        entityName: "Problem",
        entityId: id,
        details: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Muammo holati muvaffaqiyatli yangilandi",
    });
  } catch (error: any) {
    console.error("Admin problem update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Muammoni yangilashda xatolik" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Muammo ID si berilmadi" },
        { status: 400 }
      );
    }

    await prisma.problem.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "ADMIN_PROBLEM_DELETED",
        entityName: "Problem",
        entityId: id,
        details: JSON.stringify({ deletedBy: auth.user.email }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Muammo muvaffaqiyatli o'chirildi",
    });
  } catch (error: any) {
    console.error("Admin problem DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Muammoni o'chirishda xatolik" },
      { status: 500 }
    );
  }
}
