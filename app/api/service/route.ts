import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");
    const isPublished = searchParams.get("isPublished");

    const services = await prisma.services.findMany({
      where: {
        ...(location && { location }),
        ...(isPublished !== null && { isPublished: isPublished === "true" }),
      },
      include: {
        faqs: true,
        subServices: {
          where: { isActive: true },
          orderBy: { isPopular: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: services }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/service:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
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
    const { faqs, subServices, whyChooseUs, ...serviceData } = data;

    const service = await prisma.services.create({
      data: {
        ...serviceData,
        whyChooseUs: whyChooseUs ?? [],
        faqs: faqs ? { create: faqs } : undefined,
        subServices: subServices ? { create: subServices } : undefined,
      },
      include: {
        faqs: true,
        subServices: true,
      },
    });
    revalidatePath("/service", "page");
    revalidatePath(`/service/${service.slug}`, "page");
    return NextResponse.json({ data: service }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
