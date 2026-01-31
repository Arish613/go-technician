import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.services.findMany({
      where: {
        reviews: {
          some: {},
        },
      },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
