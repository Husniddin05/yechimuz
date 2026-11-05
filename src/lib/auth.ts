import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "XAVFSIZLIK XATOSI: Production muhitida JWT_SECRET kaliti (.env) o'rnatilishi shart!"
      );
    }
    return "yechimuz_dev_jwt_secret_key_2026_do_not_use_in_prod";
  }
  return secret;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  roles: string[];
}

export const ROLES = {
  USER: "USER",
  SOLVER: "SOLVER",
  PROBLEM_OWNER: "PROBLEM_OWNER",
  COMPANY: "COMPANY",
  STARTUP: "STARTUP",
  EXPERT: "EXPERT",
  SPONSOR: "SPONSOR",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthTokenFromCookies(): string | null {
  try {
    const cookieStore = cookies();
    return cookieStore.get("yechimuz_token")?.value || null;
  } catch {
    return null;
  }
}

export function getCurrentUserFromToken(): JWTPayload | null {
  const token = getAuthTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

export function hasRole(userRoles: string[], requiredRole: string): boolean {
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true;
  return userRoles.includes(requiredRole);
}

export function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true;
  return requiredRoles.some((role) => userRoles.includes(role));
}
