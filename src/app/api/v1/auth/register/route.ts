import { NextResponse } from "next/server";
import { RegisterSchema } from "@/validators/auth.schema";
import { AuthService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    const result = await AuthService.register(validatedData);

    const response = NextResponse.json(
      {
        success: true,
        message: "Ro'yxatdan muvaffaqiyatli o'tdingiz!",
        data: result.user,
        token: result.token,
      },
      { status: 201 }
    );

    // Set secure HttpOnly cookie
    response.cookies.set("yechimuz_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Ma'lumotlar noto'g'ri kiritildi",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Ro'yxatdan o'tishda xatolik yuz berdi.",
      },
      { status: 400 }
    );
  }
}
