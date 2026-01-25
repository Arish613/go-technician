"use server";

import { prisma } from "@/lib/prisma";
import { Review } from "@/types/review";

// Create a review
export async function createReview(
  data: Omit<Review, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const review = await prisma.review.create({
      data,
    });
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

export async function getReviewById(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    return review;
  } catch (error) {
    console.log("Error fetching review by ID:", error);
    return null;
  }
}

// Update a review
export async function updateReview(
  id: string,
  data: Partial<Omit<Review, "id" | "createdAt" | "updatedAt">>,
) {
  try {
    return prisma.review.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.log("Error updating review:", error);
    return null;
  }
}

// Delete a review
export async function deleteReview(id: string) {
  try {
    return prisma.review.delete({
      where: { id },
    });
  } catch (error) {
    console.log("Error deleting review:", error);
    return null;
  }
}

export async function getAllReviewsGroupedByService() {
  try {
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
      },
      orderBy: { name: "asc" },
    });

    return services;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
