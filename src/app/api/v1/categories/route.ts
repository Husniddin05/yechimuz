import { NextResponse } from "next/server";
import { ProblemService } from "@/services/problem.service";

export async function GET() {
  try {
    const categories = await ProblemService.getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Kategoriyalarni olishda xatolik" },
      { status: 500 }
    );
  }
}
