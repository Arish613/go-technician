import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        reviews: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            rating: true,
            comment: true,
            reviewer: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching category reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch category reviews" },
      { status: 500 }
    );
  }
}
