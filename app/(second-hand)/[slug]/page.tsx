import { getCategoryBySlug } from "@/lib/action/product";
import { notFound } from "next/navigation";
import { SecondHandClient } from "@/components/second-hand/SecondHandClient";
import { StickyCart } from "@/components/cart/StickyCart";
import { getBreadcrumbSchema } from "@/lib/seo/breadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SecondHandPageProps {
  params: {
    slug: string;
  };
}

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
  const products = category.products ?? [];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Second Hand", url: "/" },
    { name: category.name, url: `/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <StickyCart />
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Second Hand</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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
      `Buy Second Hand ${category.name} in Mumbai | Gotechnicians`,
    description:
      category.metaDescription ||
      `Shop verified second-hand ${category.name} at the best prices. Quality checked, genuine products with easy returns.`,
    openGraph: {
      title:
        category.metaTitle ||
        `Buy Second Hand ${category.name} in Mumbai | Gotechnicians`,
      description:
        category.metaDescription ||
        `Shop verified second-hand ${category.name} at the best prices.`,
      images: category.image ? [category.image] : [],
    },
    alternates: {
      canonical: `/${category.slug}`,
    },
  };
}
