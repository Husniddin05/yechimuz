import { NextResponse } from "next/server";
import { ProblemService } from "@/services/problem.service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const problem = await ProblemService.getProblemById(params.id);
    return NextResponse.json({
      success: true,
      data: problem,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Muammo topilmadi" },
      { status: 404 }
    );
  }
}
