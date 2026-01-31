import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);
  if(!session){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const data = await request.json();
    const { faqs, subServices, whyChooseUs, ...serviceData } = data;

    // Check if new slug already exists (only if slug is being changed)
    if (data.slug && data.slug !== slug) {
      const existingService = await prisma.services.findUnique({
        where: { slug: data.slug },
      });

      if (existingService && existingService.id !== data.id) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 },
        );
      }
    }

    const service = await prisma.services.update({
      where: { slug },
      data: {
        ...serviceData,
        whyChooseUs: whyChooseUs ?? [],
        faqs: faqs
          ? {
              deleteMany: {},
              create: faqs,
            }
          : undefined,
        subServices: subServices
          ? {
              deleteMany: {},
              create: subServices,
            }
          : undefined,
      },
      include: {
        faqs: true,
        subServices: true,
      },
    });

    revalidatePath("/service", "page");
    revalidatePath(`/service/${service.slug}`, "page");

    return NextResponse.json({ data: service }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/service/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}
