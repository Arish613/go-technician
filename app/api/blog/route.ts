import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublishedParam = searchParams.get("isPublished");
    
    const isPublished = isPublishedParam === "true" ? true : isPublishedParam === "false" ? false : undefined;

    const blogs = await prisma.blog.findMany({
      where: isPublished !== undefined ? { isPublished } : {},
      include: { faqs: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}