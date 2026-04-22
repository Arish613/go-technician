"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLocationPageBySlug(slug: string) {
  try {
    const locationPage = await prisma.locationPage.findFirst({
      where: { slug },
      select: {
        id: true,
        slug: true,
        serviceSlug: true,
        location: true,
        title: true,
        metaTitle: true,
        description: true,
        content: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        locality: true,
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true,
            locationPageId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!locationPage) {
      return { success: false, error: "Location page not found" };
    }

    return { success: true, data: locationPage };
  } catch (error) {
    console.error("Error fetching location page:", error);
    return { success: false, error: "Failed to fetch location page" };
  }
}

export async function getLocationPageById(id: string) {
  try {
    const locationPage = await prisma.locationPage.findUnique({
      where: { id },
      include: {
        faqs: true,
      },
    });

    if (!locationPage) {
      return { success: false, error: "Location page not found" };
    }

    return { success: true, data: locationPage };
  } catch (error) {
    console.error("Error fetching location page:", error);
    return { success: false, error: "Failed to fetch location page" };
  }
}

export async function getCityLevelLocationPages() {
  try {
    const pages = await prisma.locationPage.findMany({
      where: {
        isPublished: true,
        OR: [
          { locality: { isSet: false } }, // field doesn't exist in document
          { locality: null }, // field exists but is null
        ],
      },
      select: {
        slug: true,
        title: true,
        location: true,
        locality: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: pages };
  } catch (error) {
    console.error("Error:", (error as Error).message);
    return { success: false, error: "Failed to fetch location pages" };
  }
}

export async function getLocationPagesByLocation(location: string) {
  try {
    const locationPages = await prisma.locationPage.findMany({
      where: { location, isPublished: true },
      orderBy: { title: "asc" },
    });

    return { success: true, data: locationPages };
  } catch (error) {
    console.error("Error fetching location pages by location:", error);
    return { success: false, error: "Failed to fetch location pages" };
  }
}

export async function getLocationPagesByServiceSlug(
  serviceSlug: string,
  excludeLocation?: string,
) {
  try {
    const locationPages = await prisma.locationPage.findMany({
      where: {
        serviceSlug,
        isPublished: true,
        ...(excludeLocation && { location: { not: excludeLocation } }),
      },
      orderBy: { title: "asc" },
      select: {
        slug: true,
        location: true,
        title: true,
      },
    });

    return { success: true, data: locationPages };
  } catch (error) {
    console.error("Error fetching location pages by service slug:", error);
    return { success: false, error: "Failed to fetch location pages" };
  }
}

export async function deleteLocationPage(id: string) {
  try {
    const page = await prisma.locationPage.delete({
      where: { id },
    });

    revalidatePath("/admin/location-pages");
    revalidatePath(`/service/${page.slug}`);
    return { success: true, message: "Location page deleted successfully" };
  } catch (error) {
    console.error("Error deleting location page:", error);
    return { success: false, error: "Failed to delete location page" };
  }
}

export async function togglePublishLocationPage(
  id: string,
  isPublished: boolean,
) {
  try {
    const page = await prisma.locationPage.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/admin/location-pages");
    revalidatePath(`/service/${page.slug}`);
    return { success: true, data: page };
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return { success: false, error: "Failed to update publish status" };
  }
}
