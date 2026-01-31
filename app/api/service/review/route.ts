import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all services with their reviews
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
        subServices: {
          include: {
            reviews: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Transform data to include subservice reviews
    const servicesWithAllReviews = services.map((service) => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      reviews: service.reviews,
      subServices: service.subServices.map((subService) => ({
        id: subService.id,
        name: subService.name,
        reviews: subService.reviews,
      })).filter((subService) => subService.reviews.length > 0),
    }));

    return NextResponse.json(servicesWithAllReviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}