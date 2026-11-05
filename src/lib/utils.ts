import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind klasslarini to'qnashuvlarsiz birlashtirish (shadcn/tailwind standarti)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * JSON matnini xavfsiz parslash funksiyasi.
 * Agar matn noto'g'ri bo'lsa yoki null kelsa, xatolik chiqarmaydi va zaxira (fallback) qiymatini qaytaradi.
 */
export function safeJsonParse<T = any>(
  value: string | null | undefined,
  fallback: T
): T {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return (value as unknown as T) || fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return fallback;
  }
}

/**
 * Valyuta va summalar formatlash (masalan: 25 000 000 UZS)
 */
export function formatCurrency(amount: number, currency = "UZS"): string {
  if (isNaN(amount)) return `0 ${currency}`;
  return `${amount.toLocaleString()} ${currency}`;
}

/**
 * Sanani o'zbekcha formatda ko'rsatish
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(date);
  }
}
