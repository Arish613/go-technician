"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateBlogInput, UpdateBlogInput } from "@/types/blog";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createBlog(data: CreateBlogInput) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const { faqs, ...blogData } = data;

    const blog = await prisma.blog.create({
      data: {
        ...blogData,
        faqs: faqs ? { create: faqs } : undefined,
      },
      include: { faqs: true },
    });

    revalidatePath("/blog");
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false, error: "Failed to create blog" };
  }
}

export async function getBlogs(isPublished?: boolean) {
  try {
    const blogs = await prisma.blog.findMany({
      where: isPublished !== undefined ? { isPublished } : {},
      include: { faqs: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: blogs };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { success: false, error: "Failed to fetch blogs" };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blog.findFirst({
      where: { slug },
      include: { faqs: true },
    });
    if (!blog) {
      return { success: false, error: "Blog not found" };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

export async function updateBlog(data: UpdateBlogInput) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const { id, faqs, ...blogData } = data;

    // If faqs are provided, delete old ones and create new ones
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...blogData,
        faqs: faqs
          ? {
              deleteMany: {},
              create: faqs,
            }
          : undefined,
      },
      include: { faqs: true },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error: "Failed to update blog" };
  }
}

export async function deleteBlog(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.blog.delete({
      where: { id },
    });

    revalidatePath("/blog");
    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { success: false, error: "Failed to delete blog" };
  }
}

export async function toggleBlogPublish(id: string, isPublished: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error: "Failed to update blog status" };
  }
}

export async function getRecentBlogs(limit: number = 3) {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return { success: true, data: blogs };
  } catch (error) {
    console.log("Error fetching recent blogs:", error);
    return { success: false, error: "Failed to fetch recent blogs" };
  }
}
