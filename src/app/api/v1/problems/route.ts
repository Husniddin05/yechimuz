import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { CreateProblemSchema } from "@/validators/problem.schema";
import { ProblemService } from "@/services/problem.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const region = searchParams.get("region") || undefined;
    const problemType = searchParams.get("problemType") || undefined;
    const severityLevel = searchParams.get("severityLevel") || undefined;
    const status = searchParams.get("status") || undefined;
    const minBudget = searchParams.get("minBudget") ? Number(searchParams.get("minBudget")) : undefined;
    const maxBudget = searchParams.get("maxBudget") ? Number(searchParams.get("maxBudget")) : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "newest";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const result = await ProblemService.getProblems({
      query,
      categoryId,
      region,
      problemType,
      severityLevel,
      status,
      minBudget,
      maxBudget,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Muammolarni olishda xatolik" },
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
    const validatedData = CreateProblemSchema.parse(body);

    const problem = await ProblemService.createProblem(user.userId, validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Muammo muvaffaqiyatli joylashtirildi!",
        data: problem,
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
      { success: false, error: error.message || "Muammoni saqlashda xatolik" },
      { status: 400 }
    );
  }
}
