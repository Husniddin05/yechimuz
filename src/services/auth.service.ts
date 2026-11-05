import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword, generateToken, JWTPayload } from "@/lib/auth";
import { RegisterInput, LoginInput, UpdateProfileInput } from "@/validators/auth.schema";
import { safeJsonParse } from "@/lib/utils";

export class AuthService {
  static async register(input: RegisterInput) {
    // Check if email or username exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          { profile: { username: input.username } },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === input.email) {
        throw new Error("Ushbu email manzil allaqachon ro'yxatdan o'tgan.");
      }
      throw new Error("Ushbu username band. Boshqa username tanlang.");
    }

    const hashedPassword = await hashPassword(input.password);

    // Fetch matching roles
    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: input.roles,
        },
      },
    });

    // Fallback: If roles don't exist yet, assign default USER role
    const assignedRoles = roles.length > 0 ? roles : await prisma.role.findMany({ where: { name: "USER" } });

    // Create user and profile transactionally
    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone || null,
        passwordHash: hashedPassword,
        isVerified: true, // Auto verify for MVP readiness
        userRoles: {
          create: assignedRoles.map((r) => ({
            role: { connect: { id: r.id } },
          })),
        },
        profile: {
          create: {
            firstName: input.firstName,
            lastName: input.lastName,
            username: input.username,
            region: input.region || "Farg'ona",
            organizationName: input.organizationName || null,
          },
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        profile: true,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        entityName: "User",
        entityId: user.id,
        details: JSON.stringify({ roles: input.roles }),
      },
    });

    const userRoles = user.userRoles.map((ur) => ur.role.name);
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.profile?.username || "",
      roles: userRoles,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
        roles: userRoles,
      },
      token,
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.emailOrUsername },
          { profile: { username: input.emailOrUsername } },
        ],
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        profile: true,
      },
    });

    if (!user) {
      throw new Error("Email yoki parol noto'g'ri.");
    }

    if (user.status !== "ACTIVE") {
      throw new Error("Sizning hisobingiz bloklangan yoki to'xtatilgan.");
    }

    const isValidPassword = await comparePassword(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Email yoki parol noto'g'ri.");
    }

    const userRoles = user.userRoles.map((ur) => ur.role.name);
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.profile?.username || "",
      roles: userRoles,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGGED_IN",
        entityName: "User",
        entityId: user.id,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
        roles: userRoles,
      },
      token,
    };
  }

  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: true },
        },
        profile: true,
      },
    });

    if (!user) {
      throw new Error("Foydalanuvchi topilmadi.");
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      status: user.status,
      createdAt: user.createdAt,
      roles: user.userRoles.map((ur) => ur.role.name),
      profile: {
        ...user.profile,
        skills: safeJsonParse<string[]>(user.profile?.skills, []),
        portfolioUrls: safeJsonParse<string[]>(user.profile?.portfolioUrls, []),
        socialLinks: safeJsonParse<Record<string, string>>(user.profile?.socialLinks, {}),
        badges: safeJsonParse<string[]>(user.profile?.badges, []),
      },
    };
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!currentProfile) {
      throw new Error("Profil topilmadi.");
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(input.firstName && { firstName: input.firstName }),
        ...(input.lastName && { lastName: input.lastName }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.region && { region: input.region }),
        ...(input.organizationName !== undefined && { organizationName: input.organizationName }),
        ...(input.occupation !== undefined && { occupation: input.occupation }),
        ...(input.skills && { skills: JSON.stringify(input.skills) }),
        ...(input.website !== undefined && { website: input.website }),
        ...(input.portfolioUrls && { portfolioUrls: JSON.stringify(input.portfolioUrls) }),
      },
    });

    return {
      ...updatedProfile,
      skills: JSON.parse(updatedProfile.skills),
      portfolioUrls: JSON.parse(updatedProfile.portfolioUrls),
      socialLinks: JSON.parse(updatedProfile.socialLinks),
      badges: JSON.parse(updatedProfile.badges),
    };
  }
}
