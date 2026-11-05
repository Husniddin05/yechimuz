import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { ProblemService } from "@/services/problem.service";

export async function GET() {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const problems = await ProblemService.getMyProblems(user.userId);

    return NextResponse.json({
      success: true,
      data: problems,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Foydalanuvchi muammolarini olishda xatolik" },
      { status: 400 }
    );
  }
}
