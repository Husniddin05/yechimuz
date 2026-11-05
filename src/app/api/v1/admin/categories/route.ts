import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/admin";

export async function GET() {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const categories = await prisma.problemCategory.findMany({
      include: {
        _count: {
          select: { problems: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Kategoriyalarni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { nameUz, nameRu, nameEn, slug, icon } = body;

    if (!nameUz || !slug) {
      return NextResponse.json(
        { success: false, error: "Nom va slug kiritilishi shart" },
        { status: 400 }
      );
    }

    const created = await prisma.problemCategory.create({
      data: {
        nameUz,
        nameRu,
        nameEn,
        slug,
        icon: icon || "Layers",
      },
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: "Yangi kategoriya yaratildi",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Kategoriya yaratishda xatolik" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { id, nameUz, nameRu, nameEn, slug, icon } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Kategoriya ID si talab qilinadi" },
        { status: 400 }
      );
    }

    const updated = await prisma.problemCategory.update({
      where: { id },
      data: {
        ...(nameUz && { nameUz }),
        ...(nameRu !== undefined && { nameRu }),
        ...(nameEn !== undefined && { nameEn }),
        ...(slug && { slug }),
        ...(icon && { icon }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Kategoriya yangilandi",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Kategoriyani yangilashda xatolik" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Kategoriya ID si talab qilinadi" },
        { status: 400 }
      );
    }

    await prisma.problemCategory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Kategoriya o'chirildi",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Kategoriyani o'chirishda xatolik" },
      { status: 500 }
    );
  }
}
