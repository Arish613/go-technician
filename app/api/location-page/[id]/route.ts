import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = await request.json();
    const { faqs, ...pageData } = data;

    const locationPage = await prisma.locationPage.update({
      where: { id },
      data: {
        ...pageData,
        faqs: faqs
          ? {
              deleteMany: {},
              create: faqs,
            }
          : undefined,
      },
      include: {
        faqs: true,
      },
    });

    revalidatePath("/admin/location-pages");
    revalidatePath(`/service/${locationPage.slug}`, "page");

    return NextResponse.json({ data: locationPage }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/location-page/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update location page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;

    const page = await prisma.locationPage.delete({
      where: { id },
    });

    revalidatePath("/admin/location-pages");
    revalidatePath(`/service/${page.slug}`, "page");

    return NextResponse.json(
      { message: "Location page deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/location-page/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete location page" },
      { status: 500 }
    );
  }
}
