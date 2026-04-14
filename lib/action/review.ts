"use server";

import { prisma } from "@/lib/prisma";
import { Review } from "@/types/review";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "../auth";

// Create a review
export async function createReview(
  data: Omit<Review, "id" | "createdAt" | "updatedAt">,
) {
  const review = await prisma.review.create({
    data,
    include: {
      service: {
        select: { slug: true },
      },
      subService: {
        select: {
          service: {
            select: { slug: true },
          },
        },
      },
      product: {
        select: {
          id: true,
          category: { select: { slug: true } },
        },
      },
    },
  });

  const slug = review.service?.slug || review.subService?.service?.slug;
  if (slug) {
    revalidatePath(`/service/${slug}`);
  }

  if (review.product) {
    revalidatePath(`/${review.product.category.slug}`);
    revalidatePath(`/${review.product.category.slug}/${review.product.id}/reviews`);
  }

  return review;
}

// Create a product review (no auth required)
export async function createProductReview(data: {
  rating: string;
  comment: string;
  reviewer: string;
  imageUrl?: string;
  productId: string | null;
  categoryId: string | null;
}) {
  const review = await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      reviewer: data.reviewer,
      imageUrl: data.imageUrl || null,
      productId: data.productId || null,
      categoryId: data.categoryId || null,
      serviceId: null,
      subServiceId: null,
    },
    include: {
      product: {
        select: {
          id: true,
          category: { select: { slug: true } },
        },
      },
      category: {
        select: { slug: true },
      },
    },
  });

  if (review.product) {
    revalidatePath(`/${review.product.category.slug}`);
    revalidatePath(`/${review.product.category.slug}/${review.product.id}/reviews`);
  } else if (review.category) {
    revalidatePath(`/${review.category.slug}`);
  }

  return review;
}

// Get all reviews for a category (submitted directly against the category, not a product)
export async function getReviewsByCategory(categoryId: string) {
  try {
    return prisma.review.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        imageUrl: true,
        reviewer: true,
        productId: true,
        serviceId: true,
        subServiceId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.log("Error fetching category reviews:", error);
    return [];
  }
}

// Get all reviews for a product
export async function getReviewsByProduct(productId: string) {
  try {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        imageUrl: true,
        reviewer: true,
        productId: true,
        serviceId: true,
        subServiceId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.log("Error fetching product reviews:", error);
    return [];
  }
}

// Get all reviews for a service
export async function getReviewsByService(serviceId: string) {
  try {
    return prisma.review.findMany({
      where: { serviceId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        imageUrl: true,
        reviewer: true,
        serviceId: true,
        subServiceId: true,
        productId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return [];
  }
}

export async function getReviewsByServiceSlug(serviceSlug: string) {
  try {
    return prisma.review.findMany({
      where: {
        service: {
          is: {
            slug: serviceSlug,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        imageUrl: true,
        reviewer: true,
        serviceId: true,
        subServiceId: true,
        productId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.log("Error fetching reviews by service slug:", error);
    return [];
  }
}


export async function getReviewsBySubService(subServiceId: string) {
  try {
    return prisma.review.findMany({
      where: { subServiceId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return [];
  }
}

// Update a review
export async function updateReview(
  id: string,
  data: Partial<Omit<Review, "id" | "createdAt" | "updatedAt">>,
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  try {
    const review = await prisma.review.update({
      where: { id },
      data,
      include: {
        service: {
          select: { slug: true },
        },
        subService: {
          select: {
            service: {
              select: { slug: true },
            },
          },
        },
        product: {
          select: {
            id: true,
            category: { select: { slug: true } },
          },
        },
      },
    });
    const slug = review.service?.slug || review.subService?.service?.slug;
    if (slug) {
      revalidatePath(`/service/${slug}`);
    }
    if (review.product) {
      revalidatePath(`/${review.product.category.slug}`);
    }

    return review;
  } catch (error) {
    console.log("Error updating review:", error);
    return null;
  }
}

// Delete a review
export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        service: {
          select: { slug: true },
        },
        subService: {
          select: {
            service: {
              select: { slug: true },
            },
          },
        },
        product: {
          select: {
            id: true,
            category: { select: { slug: true } },
          },
        },
      },
    });

    if (!review) return null;

    await prisma.review.delete({
      where: { id },
    });

    const slug = review.service?.slug || review.subService?.service?.slug;
    if (slug) {
      revalidatePath(`/service/${slug}`);
    }
    if (review.product) {
      revalidatePath(`/${review.product.category.slug}`);
    }

    return review;
  } catch (error) {
    console.log("Error deleting review:", error);
    return null;
  }
}
