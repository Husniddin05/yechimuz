import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { ShortlistSchema } from "@/validators/solution.schema";
import { SolutionService } from "@/services/solution.service";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ShortlistSchema.parse(body);

    const shortlist = await SolutionService.shortlistSolution(user.userId, validatedData);

    return NextResponse.json({
      success: true,
      message: "Yechim shortlist qilindi!",
      data: shortlist,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Shortlist qilishda xatolik" },
      { status: 400 }
    );
  }
}
