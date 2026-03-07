import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: List all products
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/second-hand/product:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST: Create a new product
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data,
      include: { category: true },
    });
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/second-hand/product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

// PATCH: Update product orders (bulk)
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { orders } = await request.json();
    
    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { error: "Invalid request: orders must be an array" },
        { status: 400 },
      );
    }

    await prisma.$transaction(
      orders.map((item: { id: string; order: number }) =>
        prisma.product.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json(
      { success: true, message: "Product order updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/second-hand/product:", error);
    return NextResponse.json(
      { error: "Failed to update product order" },
      { status: 500 },
    );
  }
}
