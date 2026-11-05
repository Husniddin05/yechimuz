import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { AuthService } from "@/services/auth.service";

export async function GET() {
  try {
    const jwtPayload = getCurrentUserFromToken();
    if (!jwtPayload) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const userData = await AuthService.getUserProfile(jwtPayload.userId);

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Foydalanuvchi ma'lumotlarini olishda xatolik" },
      { status: 400 }
    );
  }
}
