import { NextResponse } from "next/server";
import { SolutionService } from "@/services/solution.service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const solution = await SolutionService.getSolutionById(params.id);
    return NextResponse.json({
      success: true,
      data: solution,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Yechim topilmadi" },
      { status: 404 }
    );
  }
}
