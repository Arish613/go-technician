import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isPublished = searchParams.get("isPublished");

    const locationPages = await prisma.locationPage.findMany({
      where: {
        ...(isPublished !== null && { isPublished: isPublished === "true" }),
      },
      include: {
        faqs: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: locationPages }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/location-page:", error);
    return NextResponse.json(
      { error: "Failed to fetch location pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const { faqs, ...pageData } = data;

    const locationPage = await prisma.locationPage.create({
      data: {
        ...pageData,
        faqs: faqs ? { create: faqs } : undefined,
      },
      include: {
        faqs: true,
      },
    });

    revalidatePath("/admin/location-pages");
    revalidatePath(`/service/${locationPage.slug}`, "page");
    return NextResponse.json({ data: locationPage }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/location-page:", error);
    return NextResponse.json(
      { error: "Failed to create location page" },
      { status: 500 }
    );
  }
}
