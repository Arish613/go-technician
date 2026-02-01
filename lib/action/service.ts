"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
// import { CreateServiceInput, UpdateServiceInput } from "@/types/service";
import { revalidatePath } from "next/cache";
import { authOptions } from "../auth";

// export async function createService(data: CreateServiceInput) {
//   try {
//     const { faqs, subServices, whyChooseUs, ...serviceData } = data;

//     const service = await prisma.services.create({
//       data: {
//         ...serviceData,
//         whyChooseUs: whyChooseUs ?? [],
//         faqs: faqs ? { create: faqs } : undefined,
//         subServices: subServices ? { create: subServices } : undefined,
//       },
//       include: {
//         faqs: true,
//         subServices: true,
//       },
//     });

//     revalidatePath("/service", "page");
//     revalidatePath("/admin/service", "page");
//     revalidatePath(`/service/${service.slug}`, "page");
//     return { success: true, data: service };
//   } catch (error) {
//     console.error("Error creating service:", error);
//     return { success: false, error: "Failed to create service" };
//   }
// }

export async function getServices(location?: string, isPublished?: boolean) {
  try {
    const services = await prisma.services.findMany({
      where: {
        ...(location && { location }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: {
        faqs: true,
        subServices: {
          where: { isActive: true },
          orderBy: { isPopular: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
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
      include: {
        faqs: true,
        subServices: {
          orderBy: { isPopular: "desc" },
        },
      },
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
    const service = await prisma.services.findFirst({
      where: { slug },
      include: {
        faqs: true,
        subServices: {
          where: { isActive: true },

          orderBy: { price: "asc" },
        },
      },
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

// export async function updateService(data: UpdateServiceInput) {
//   try {
//     const { id, faqs, subServices, whyChooseUs, ...serviceData } = data;

//     const service = await prisma.services.update({
//       where: { id },
//       data: {
//         ...serviceData,
//         whyChooseUs: whyChooseUs ?? [],
//         faqs: faqs
//           ? {
//               deleteMany: {},
//               create: faqs,
//             }
//           : undefined,
//         subServices: subServices
//           ? {
//               deleteMany: {},
//               create: subServices,
//             }
//           : undefined,
//       },
//       include: {
//         faqs: true,
//         subServices: true,
//       },
//     });

//     revalidatePath("/service", "page");
//     revalidatePath("/admin/service", "page");
//     revalidatePath(`/service/${service.slug}`, "page");
//     return { success: true, data: service };
//   } catch (error) {
//     console.error("Error updating service:", error);
//     return { success: false, error: "Failed to update service" };
//   }
// }

export async function deleteService(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.services.delete({
      where: { id },
    });

    revalidatePath("/service", "page");
    revalidatePath("/admin/service", "page");
    return { success: true, message: "Service deleted successfully" };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete service" };
  }
}

// New function to get subservices by service and type
export async function getSubServicesByType(serviceId: string, type?: string) {
  try {
    const subServices = await prisma.subService.findMany({
      where: {
        serviceId,
        isActive: true,
        ...(type && { type }),
      },
      orderBy: { isPopular: "desc" },
    });

    return { success: true, data: subServices };
  } catch (error) {
    console.error("Error fetching subservices:", error);
    return { success: false, error: "Failed to fetch subservices" };
  }
}

export async function getServiceAndSubService(userInput: string) {
  try {
    if (!userInput || userInput.trim() === "") {
      return [];
    }
    // Special case: if user searches for "ac service" (case-insensitive, ignore spaces/symbols)
    const normalizedInput = userInput.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (normalizedInput.includes("acservice")) {
      return [
        {
          type: "service",
          name: "AC Service",
          slug: "ac-repair-service",
        },
      ];
    }
    const services = await prisma.services.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: userInput, mode: "insensitive" } },
          { slug: { contains: userInput, mode: "insensitive" } },
        ],
      },
    });

    const subServices = await prisma.subService.findMany({
      where: {
        isActive: true,
        OR: [{ name: { contains: userInput, mode: "insensitive" } }],
      },
      select: {
        name: true,
        service: {
          select: {
            slug: true,
          },
        },
      },
    });

    const results = [
      ...services.map((service) => ({
        type: "service",
        name: service.name,
        slug: service.slug,
      })),
      ...subServices.map((subService) => ({
        type: "subService",
        name: subService.name,
        slug: subService.service.slug,
      })),
    ];

    return results;
  } catch (error) {
    console.error("Error fetching service and subservice:", error);
    return [];
  }
}

export async function togglePublishService(id: string, isPublished: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const service = await prisma.services.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath("/service", "page");
    revalidatePath(`/service/${service.slug}`, "page");
    return { success: true, data: service };
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return { success: false, error: "Failed to update publish status" };
  }
}

export async function getSubServiceForGivenService(serviceId: string) {
  try {
    const subServices = await prisma.subService.findMany({
      where: {
        serviceId: serviceId,
        isActive: true,
      },
      orderBy: { price: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
    return { success: true, data: subServices };
  } catch (error) {
    console.error("Error fetching subservices:", error);
    return { success: false, error: "Failed to fetch subservices" };
  }
}
