import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { SubServiceInput } from "@/types/service";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const data = await request.json();
    const { faqs, subServices, whyChooseUs, benefits, cityId, localityId, ...serviceData } = data;

    const service = await prisma.services.update({
      where: { slug },
      data: {
        ...serviceData,
        cityId: cityId === "" ? null : cityId,
        localityId: localityId === "" ? null : localityId,
        whyChooseUs: whyChooseUs ?? [],
        benefits: benefits ?? [],
        faqs: faqs
          ? {
              deleteMany: {},
              create: faqs,
            }
          : undefined,
        subServices: subServices
          ? {
              deleteMany: {},
              create: (subServices as SubServiceInput[]).map((sub) => {
                const { pricings, ...subData } = sub;
                return {
                  ...subData,
                  pricings: pricings?.length
                    ? { create: pricings }
                    : undefined,
                };
              }),
            }
          : undefined,
      },
      include: {
        faqs: true,
        subServices: {
          include: {
            pricings: true,
          },
        },
      },
    });

    revalidatePath("/service", "page");
    revalidatePath(`/service/${slug}`, "page");

    if (service.slug !== slug) {
      revalidatePath(`/service/${service.slug}`, "page");
    }

    return NextResponse.json({ data: service }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/service/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}
