"use server";

import { prisma } from "@/lib/prisma";

// GET: single category by slug, with its available products
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: category };
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return { success: false, error: "Failed to fetch category" };
  }
}
