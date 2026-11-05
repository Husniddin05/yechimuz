import { NextResponse } from "next/server";
import { getCurrentUserFromToken, ROLES } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Profile, UserRole, Role } from "@prisma/client";

export type AdminUserWithProfile = User & {
  profile: Profile | null;
  userRoles: (UserRole & { role: Role })[];
  roles: string[];
};

export type AdminAuthResult =
  | {
      authorized: true;
      response: null;
      user: AdminUserWithProfile;
    }
  | {
      authorized: false;
      response: NextResponse;
      user: null;
    };

export async function checkAdminAccess(): Promise<AdminAuthResult> {
  const payload = getCurrentUserFromToken();
  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      ),
      user: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      userRoles: {
        include: { role: true },
      },
      profile: true,
    },
  });

  if (!user || user.status === "BANNED" || user.status === "SUSPENDED") {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Hisob bloklangan yoki mavjud emas" },
        { status: 403 }
      ),
      user: null,
    };
  }

  const roleNames = user.userRoles.map((ur) => ur.role.name);
  const isAdmin =
    roleNames.includes(ROLES.ADMIN) ||
    roleNames.includes(ROLES.SUPER_ADMIN) ||
    roleNames.includes("MODERATOR");

  if (!isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Ushbu amalni bajarish uchun admin ruxsati talab qilinadi" },
        { status: 403 }
      ),
      user: null,
    };
  }

  return {
    authorized: true,
    response: null,
    user: {
      ...user,
      roles: roleNames,
    },
  };
}
