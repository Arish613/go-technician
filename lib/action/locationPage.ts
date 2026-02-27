"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLocationPageBySlug(slug: string) {
  try {
    const locationPage = await prisma.locationPage.findFirst({
      where: { slug },
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

export async function getAllLocationPages(publishedOnly?: boolean) {
  try {
    const locationPages = await prisma.locationPage.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      include: {
        faqs: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: locationPages };
  } catch (error) {
    console.error("Error fetching location pages:", error);
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
  isPublished: boolean
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
