import { NextResponse } from "next/server";
import { SolutionService } from "@/services/solution.service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const solutions = await SolutionService.getSolutionsForProblem(params.id);
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
