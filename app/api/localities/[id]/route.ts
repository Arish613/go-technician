import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Locality ID required" }, { status: 400 });
    }

    const data = await request.json();
    const locality = await prisma.locality.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        cityId: data.cityId,
        isActive: data.isActive,
      },
      include: {
        city: true,
      },
    });
    return NextResponse.json({ data: locality }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/localities/[id]:", error);
    return NextResponse.json({ error: "Failed to update locality" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Locality ID required" }, { status: 400 });
    }

    await prisma.locality.delete({
      where: { id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/localities/[id]:", error);
    return NextResponse.json({ error: "Failed to delete locality" }, { status: 500 });
  }
}
