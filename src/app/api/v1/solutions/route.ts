import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { CreateSolutionSchema } from "@/validators/solution.schema";
import { SolutionService } from "@/services/solution.service";

export async function GET() {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const solutions = await SolutionService.getMySolutions(user.userId);
    return NextResponse.json({
      success: true,
      data: solutions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Yechimlarni olishda xatolik" },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CreateSolutionSchema.parse(body);

    const solution = await SolutionService.submitSolution(user.userId, validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Yechim taklifi muvaffaqiyatli yuborildi!",
        data: solution,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Ma'lumotlar noto'g'ri kiritildi", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Yechim yuborishda xatolik" },
      { status: 400 }
    );
  }
}
