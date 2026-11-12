import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { ChatService } from "@/services/chat.service";

export async function GET() {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const chats = await ChatService.getMyChatRooms(user.userId);

    return NextResponse.json({
      success: true,
      data: chats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Chatlar ro'yxatini yuklashda xatolik" },
      { status: 400 }
    );
  }
}
