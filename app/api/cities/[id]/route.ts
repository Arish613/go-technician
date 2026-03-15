import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        localities: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
    });
    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    return NextResponse.json({ data: city }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/cities/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch city" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const city = await prisma.city.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive,
      },
    });
    return NextResponse.json({ data: city }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/cities/[id]:", error);
    return NextResponse.json({ error: "Failed to update city" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.city.delete({
      where: { id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/cities/[id]:", error);
    return NextResponse.json({ error: "Failed to delete city" }, { status: 500 });
  }
}
