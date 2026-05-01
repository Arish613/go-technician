import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { WhyChooseUsItem, Faq } from "@/types/product";

interface CreateCategoryRequest {
  name: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
  isVisible: boolean;
  content?: string;
  whyChooseUs?: WhyChooseUsItem[];
  faqs?: Omit<Faq, "id" | "createdAt" | "updatedAt" | "categoryId">[];
}

// GET: List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        products: true,
        faqs: true,
      },
    });
    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/second-hand/category:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

// POST: Create a new category
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = (await request.json()) as CreateCategoryRequest;
    const { faqs, whyChooseUs, ...rest } = data;

    const category = await prisma.category.create({
      data: {
        ...rest,
        whyChooseUs: whyChooseUs || [],
        faqs:
          faqs && faqs.length > 0
            ? {
                create: faqs.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                })),
              }
            : undefined,
      },
      include: {
        products: true,
        faqs: true,
      },
    });
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/second-hand/category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}