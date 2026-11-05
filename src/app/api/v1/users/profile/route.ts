import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { AuthService } from "@/services/auth.service";
import { UpdateProfileSchema } from "@/validators/auth.schema";

export async function PUT(request: Request) {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateProfileSchema.parse(body);

    const updatedProfile = await AuthService.updateProfile(user.userId, validatedData);

    return NextResponse.json({
      success: true,
      message: "Profil ma'lumotlari yangilandi!",
      data: updatedProfile,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Noto'g'ri ma'lumotlar", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Profilni yangilashda xatolik" },
      { status: 400 }
    );
  }
}
