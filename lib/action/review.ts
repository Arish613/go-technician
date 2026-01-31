"use server";

import { prisma } from "@/lib/prisma";
import { Review } from "@/types/review";
import { revalidatePath } from "next/cache";

// Create a review
export async function createReview(
  data: Omit<Review, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const review = await prisma.review.create({
      data,
      include: {
        service: {
          select: { slug: true },
        },
      },
    });

    revalidatePath(`/service/${review.service.slug}`);
    return review;
  } catch (error) {
    console.log("Error creating review:", error);
    return null;
  }
}

// Get all reviews for a service
export async function getReviewsByService(serviceId: string) {
  try {
    return prisma.review.findMany({
      where: { serviceId },
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
  try {
    const review = await prisma.review.update({
      where: { id },
      data,
      include: {
        service: {
          select: { slug: true },
        },
      },
    });

    revalidatePath(`/service/${review.service.slug}`);

    return review;
  } catch (error) {
    console.log("Error updating review:", error);
    return null;
  }
}

// Delete a review
export async function deleteReview(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        service: {
          select: { slug: true },
        },
      },
    });

    if (!review) return null;

    await prisma.review.delete({
      where: { id },
    });

    revalidatePath(`/service/${review.service.slug}`);
    return review;
  } catch (error) {
    console.log("Error deleting review:", error);
    return null;
  }
}
