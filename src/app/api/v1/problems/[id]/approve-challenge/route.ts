import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

    const problem = await prisma.problem.findUnique({
      where: { id: params.id },
      include: { challenge: true },
    });

    if (!problem || !problem.challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge topilmadi" },
        { status: 404 }
      );
    }

    // Faqatgina muammoni joylagan inson (yoki admin) AI Challenge'ni tasdiqlashi mumkin
    const isOwner = problem.ownerId === user.userId;
    const isAdmin = user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN");

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Faqatgina muammoni joylashtirgan muallif AI Challenge'ni tasdiqlashi va chop etishi mumkin!",
        },
        { status: 403 }
      );
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: problem.challenge.id },
      data: { isOwnerApproved: true },
    });

    await prisma.problem.update({
      where: { id: params.id },
      data: { status: "CHALLENGE_READY" },
    });

    return NextResponse.json({
      success: true,
      message: "AI Challenge formati tasdiqlandi va chop etildi!",
      data: updatedChallenge,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Challenge tasdiqlashda xatolik" },
      { status: 400 }
    );
  }
}
