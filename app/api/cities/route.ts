import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CreateCityRequest {
  name: string;
  slug: string;
  isActive?: boolean;
}

export async function GET() {
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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = (await request.json()) as CreateCityRequest;
    const city = await prisma.city.create({
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json({ data: city }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/cities:", error);
    return NextResponse.json({ error: "Failed to create city" }, { status: 500 });
  }
}
