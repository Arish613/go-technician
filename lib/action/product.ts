"use server";

import { prisma } from "@/lib/prisma";

// GET: single category by slug, with its available products
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { order: "asc" },
          include: {
            city: true,
            locality: true,
            reviews: {
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                rating: true,
                comment: true,
                reviewer: true,
                imageUrl: true,
                createdAt: true,
              },
            },
          },
        },
        faqs: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            rating: true,
            comment: true,
            reviewer: true,
            imageUrl: true,
            createdAt: true,
          },
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

// GET: single product by id, with category info
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        city: true,
        locality: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

// GET: all products for dropdown
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        category: { select: { name: true } },
      },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}
