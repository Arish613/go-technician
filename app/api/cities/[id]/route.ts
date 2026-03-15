import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
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

  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
      include: {
        localities: true,
        _count: {
          select: { products: true, localities: true },
        },
      },
    });
    return NextResponse.json({ data: cities }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/cities:", error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "City ID required" }, { status: 400 });
    }

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

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "City ID required" }, { status: 400 });
    }

    await prisma.city.delete({
      where: { id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/cities/[id]:", error);
    return NextResponse.json({ error: "Failed to delete city" }, { status: 500 });
  }
}
