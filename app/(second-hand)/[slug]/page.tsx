import { getCategoryBySlug } from "@/lib/action/product";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StickyCart } from "@/components/cart/StickyCart";
import { ProductCard } from "@/components/second-hand/ProductCard";
import { ShieldCheck, Clock, Award, BadgeCheck, Headphones, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SecondHandPageProps {
  params: {
    slug: string;
  };
}

const ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-primary" />,
  BadgeCheck: <BadgeCheck className="h-6 w-6 text-primary" />,
  Clock: <Clock className="h-6 w-6 text-primary" />,
  RefreshCw: <RefreshCw className="h-6 w-6 text-primary" />,
  Headphones: <Headphones className="h-6 w-6 text-primary" />,
  Award: <Award className="h-6 w-6 text-primary" />,
};

function renderIcon(icon?: string) {
  if (!icon) return ICONS.ShieldCheck;
  return ICONS[icon] || ICONS.ShieldCheck;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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
  const availableCount = products.filter((p) => p.isAvailable).length;

  return (
    <div className="min-h-screen">
      <StickyCart />

      <div className="lg:grid md:grid-cols-2">
        {/* LEFT — sticky hero image + info */}
        <section className="lg:sticky lg:top-10 lg:h-screen lg:mt-10">
          <div className="md:mx-20">
            {category.image && (
              <div className="w-full max-h-56 md:max-h-125 lg:max-h-175 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={1000}
                  height={700}
                  priority
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* Benefits/info strip below image (desktop only) */}
            <div className="hidden md:block py-8 px-4 md:px-0 max-w-xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-4 capitalize">
                {category.name}
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  Quality checked by our technicians
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  Genuine &amp; verified products
                </li>
                <li className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-teal-600 shrink-0" />
                  Easy returns policy
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  Fast delivery across Mumbai &amp; Thane
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* RIGHT — product cards */}
        <section id="products" className="py-6 md:py-10 col-span-2 lg:col-span-1">
          <div className="md:mx-20 px-4">
            {/* Header */}
            <div className="space-y-3 mb-6">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight capitalize">
                {category.name}
              </h1>

              {category.metaDescription && (
                <p className="text-sm md:text-base text-muted-foreground">
                  {category.metaDescription}
                </p>
              )}

              <p className="text-xs md:text-sm text-muted-foreground">
                {availableCount} product{availableCount !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <div className="flex flex-col gap-10 md:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No products listed yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Why Buy from Us                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative py-16 md:py-24 bg-slate-50 overflow-hidden">
        <div className="md:mx-20 px-4">
          {/* ...background pattern... */}
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-5 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Why Buy{" "}
                <span className="text-primary">{category.name}</span> from Us?
              </h2>
              <p className="text-sm md:text-lg text-slate-600">
                Experience reliability, transparency, and value with every
                second-hand purchase.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(category.whyChooseUs && category.whyChooseUs.length > 0
                ? category.whyChooseUs
                : []
              ).map((item, idx) => (
                <Card
                  key={idx}
                  className="group relative h-full border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden py-4"
                >
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300">
                      {renderIcon(item.icon)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="text-center md:px-6">
                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {/* Optionally, fallback to a message if empty */}
              {(!category.whyChooseUs || category.whyChooseUs.length === 0) && (
                <div className="col-span-full text-center text-muted-foreground">
                  No highlights available for this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FAQs                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section id="faqs" className="py-12 md:py-16 md:mx-20 px-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-5 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Common questions about buying second-hand{" "}
              {category.name.toLowerCase()} from Go Technicians
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {(category.faqs && category.faqs.length > 0
              ? category.faqs
              : []
            ).map((faq, idx) => (
              <AccordionItem key={faq.id || idx} value={`item-${idx}`}>
                <AccordionTrigger className="md:py-4 text-left text-xs md:text-base font-semibold text-slate-900 hover:no-underline cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="md:pb-4 text-xs md:text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
            {/* Optionally, fallback to a message if empty */}
            {(!category.faqs || category.faqs.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                No FAQs available for this category.
              </div>
            )}
          </Accordion>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Can&apos;t find what you need? Contact us and we&apos;ll help you
            find the best second-hand {category.name.toLowerCase()} for your
            budget.
          </p>
          <Link href="/contact" prefetch={true}>
            <Button size="lg" variant="secondary">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
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
