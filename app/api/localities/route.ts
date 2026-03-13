import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CreateLocalityRequest {
  name: string;
  slug: string;
  cityId: string;
  isActive?: boolean;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("cityId");

  try {
    const localities = await prisma.locality.findMany({
      where: cityId ? { cityId } : undefined,
      orderBy: { name: "asc" },
      include: {
        city: true,
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json({ data: localities }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/localities:", error);
    return NextResponse.json({ error: "Failed to fetch localities" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = (await request.json()) as CreateLocalityRequest;
    const locality = await prisma.locality.create({
      data: {
        name: data.name,
        slug: data.slug,
        cityId: data.cityId,
        isActive: data.isActive ?? true,
      },
      include: {
        city: true,
      },
    });
    return NextResponse.json({ data: locality }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/localities:", error);
    return NextResponse.json({ error: "Failed to create locality" }, { status: 500 });
  }
}
