import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Tizimdan muvaffaqiyatli chiqdingiz.",
  });

  response.cookies.delete("yechimuz_token");
  return response;
}
