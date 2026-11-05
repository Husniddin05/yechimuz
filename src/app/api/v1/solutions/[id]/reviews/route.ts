import { NextResponse } from "next/server";
import { getCurrentUserFromToken, hasAnyRole, ROLES } from "@/lib/auth";
import { ExpertReviewSchema } from "@/validators/solution.schema";
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

    // Ensure user is an Expert, Admin, or Super Admin
    if (!hasAnyRole(user.roles, [ROLES.EXPERT, ROLES.ADMIN, ROLES.SUPER_ADMIN])) {
      return NextResponse.json(
        { success: false, error: "Faqat soha ekspertlari baholash huquqiga ega." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = ExpertReviewSchema.parse({
      ...body,
      solutionId: params.id,
    });

    const review = await SolutionService.submitExpertReview(user.userId, validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Ekspert xulosasi va ballari saqlandi!",
        data: review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Noto'g'ri baholash mezonlari", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Baholashda xatolik yuz berdi" },
      { status: 400 }
    );
  }
}
