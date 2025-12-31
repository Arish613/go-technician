"use server";

import { prisma } from "@/lib/prisma";
import { CreateServiceInput, UpdateServiceInput } from "@/types/service";
import { revalidatePath } from "next/cache";


export async function createService(data: CreateServiceInput) {
  try {
    const { faqs, ...serviceData } = data;

    const service = await prisma.services.create({
      data: {
        ...serviceData,
        faqs: faqs ? { create: faqs } : undefined,
      },
      include: { faqs: true },
    });

    revalidatePath("/services");
    return { success: true, data: service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "Failed to create service" };
  }
}

export async function getServices(location?: string) {
  try {
    const services = await prisma.services.findMany({
      where: location ? { location } : {},
      include: { faqs: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: services };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { success: false, error: "Failed to fetch services" };
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await prisma.services.findUnique({
      where: { id },
      include: { faqs: true },
    });

    if (!service) {
      return { success: false, error: "Service not found" };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("Error fetching service:", error);
    return { success: false, error: "Failed to fetch service" };
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.services.findUnique({
      where: { slug },
      include: { faqs: true },
    });

    if (!service) {
      return { success: false, error: "Service not found" };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("Error fetching service:", error);
    return { success: false, error: "Failed to fetch service" };
  }
}

export async function updateService(data: UpdateServiceInput) {
  try {
    const { id, faqs, ...serviceData } = data;

    const service = await prisma.services.update({
      where: { id },
      data: {
        ...serviceData,
        faqs: faqs
          ? {
              deleteMany: {},
              create: faqs,
            }
          : undefined,
      },
      include: { faqs: true },
    });

    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    return { success: true, data: service };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Failed to update service" };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.services.delete({
      where: { id },
    });

    revalidatePath("/services");
    return { success: true, message: "Service deleted successfully" };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete service" };
  }
}