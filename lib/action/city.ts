"use server";

import { prisma } from "@/lib/prisma";

export async function getCityBySlug(slug: string) {
  try {
    const city = await prisma.city.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });
    return { success: true, data: city ?? null };
  } catch (error) {
    console.error("Error fetching city by slug:", error);
    return { success: false, data: null };
  }
}
