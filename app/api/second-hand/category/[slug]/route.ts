import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { WhyChooseUsItem, Faq } from "@/types/product";

interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
  isVisible?: boolean;
  content?: string;
  whyChooseUs?: WhyChooseUsItem[];
  faqs?: Omit<Faq, "id" | "createdAt" | "updatedAt" | "categoryId">[];
}

// GET: Get category by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: true,
        faqs: true,
      },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: category }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/second-hand/category/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

// PUT: Update category by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = (await request.json()) as UpdateCategoryRequest;
    const { whyChooseUs, faqs, ...rest } = data;

    const updateData: Record<string, unknown> = {
      ...rest,
      whyChooseUs: whyChooseUs || [],
    };

    // If faqs are provided, replace them
    if (faqs && Array.isArray(faqs)) {
      // Get category ID first
      const existingCategory = await prisma.category.findUnique({
        where: { slug },
      });

      if (existingCategory) {
        // Delete existing FAQs for this category
        await prisma.faq.deleteMany({
          where: { categoryId: existingCategory.id },
        });
        // Create new FAQs
        if (faqs.length > 0) {
          updateData.faqs = {
            create: faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            })),
          };
        }
      }
    }

    const category = await prisma.category.update({
      where: { slug },
      data: updateData,
      include: {
        products: true,
        faqs: true,
      },
    });
    return NextResponse.json({ data: category }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/second-hand/category/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

// DELETE: Delete category by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.category.delete({
      where: { slug },
    });
    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/second-hand/category/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}