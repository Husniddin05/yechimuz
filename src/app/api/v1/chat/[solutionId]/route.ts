import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { ChatService } from "@/services/chat.service";

export async function GET(
  request: Request,
  { params }: { params: { solutionId: string } }
) {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const chatData = await ChatService.getChatRoom(user.userId, params.solutionId);

    return NextResponse.json({
      success: true,
      data: chatData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Chat ma'lumotlarini yuklashda xatolik" },
      { status: error.message?.includes("huquqi yo'q") ? 403 : 400 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { solutionId: string } }
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
    const { content } = body;

    const message = await ChatService.sendMessage(
      user.userId,
      params.solutionId,
      content
    );

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Xabar yuborishda xatolik" },
      { status: error.message?.includes("huquqi yo'q") ? 403 : 400 }
    );
  }
}
