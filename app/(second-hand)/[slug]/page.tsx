import { getCategoryBySlug } from "@/lib/action/product";
import { notFound } from "next/navigation";
import { SecondHandClient } from "@/components/second-hand/SecondHandClient";
import { StickyCart } from "@/components/cart/StickyCart";
import { Prisma } from "@prisma/client";

interface SecondHandPageProps {
  params: {
    slug: string;
  };
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { city: true; locality: true };
}>;

export default async function SecondHandCategoryPage({
  params,
}: SecondHandPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const result = await getCategoryBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const category = result.data;
  const products = (category.products ?? []) as ProductWithRelations[];

  return (
    <>
      <StickyCart />
      <SecondHandClient category={category} initialProducts={products} />
    </>
  );
}

export async function generateMetadata({ params }: SecondHandPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const result = await getCategoryBySlug(slug);

  if (!result.success || !result.data) {
    return { title: "Category Not Found" };
  }

  const category = result.data;

  return {
    title:
      category.metaTitle ||
      `Buy Second Hand ${category.name} in Mumbai | Go Technicians`,
    description:
      category.metaDescription ||
      `Shop verified second-hand ${category.name} at the best prices. Quality checked, genuine products with easy returns.`,
    openGraph: {
      title:
        category.metaTitle ||
        `Buy Second Hand ${category.name} in Mumbai | Go Technicians`,
      description:
        category.metaDescription ||
        `Shop verified second-hand ${category.name} at the best prices.`,
      images: category.image ? [category.image] : [],
    },
    alternates: {
      canonical: `/second-hand/${category.slug}`,
    },
  };
}
