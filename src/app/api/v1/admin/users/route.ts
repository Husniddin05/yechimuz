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
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);

    const result = await AdminService.getUsers({
      search,
      role,
      status,
      page,
      limit,
    });

    return ApiResponse.success(result);
  } catch (error: any) {
    console.error("Admin users GET error:", error);
    return ApiResponse.serverError(error);
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { userId, status, addRole, removeRole } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Foydalanuvchi ID si ko'rsatilmadi" },
        { status: 400 }
      );
    }

    if (status) {
      await prisma.user.update({
        where: { id: userId },
        data: { status },
      });
    }

    if (addRole) {
      const roleRecord = await prisma.role.findUnique({
        where: { name: addRole },
      });
      if (roleRecord) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId,
              roleId: roleRecord.id,
            },
          },
          update: {},
          create: {
            userId,
            roleId: roleRecord.id,
          },
        });
      }
    }

    if (removeRole) {
      const roleRecord = await prisma.role.findUnique({
        where: { name: removeRole },
      });
      if (roleRecord) {
        await prisma.userRole.deleteMany({
          where: {
            userId,
            roleId: roleRecord.id,
          },
        });
      }
    }

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "ADMIN_USER_MODIFIED",
        entityName: "User",
        entityId: userId,
        details: JSON.stringify({ status, addRole, removeRole }),
      },
    });

    // Return updated user
    const updated = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userRoles: { include: { role: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated?.id,
        email: updated?.email,
        status: updated?.status,
        roles: updated?.userRoles.map((ur) => ur.role.name) || [],
      },
      message: "Foydalanuvchi ma'lumotlari muvaffaqiyatli saqlandi",
    });
  } catch (error: any) {
    console.error("Admin user PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Foydalanuvchini yangilashda xatolik" },
      { status: 500 }
    );
  }
}
