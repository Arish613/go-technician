import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.log("Error fetching review by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 },
    );
  }
}
