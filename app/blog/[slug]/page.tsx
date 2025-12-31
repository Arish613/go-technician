import { getBlogBySlug } from "@/lib/action/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const result = await getBlogBySlug(params.slug);

  if (!result.success || !result.data) {
    return {
      title: "Blog Not Found",
    };
  }

  const blog = result.data;

  return {
    title: blog.metaTitle || blog.h1,
    description: blog.metaDescription,
    openGraph: {
      title: blog.metaTitle || blog.h1,
      description: blog.metaDescription,
      images: [blog.imageUrl],
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle || blog.h1,
      description: blog.metaDescription,
      images: [blog.imageUrl],
    },
    alternates: {
      canonical: blog.canonicalUrl || undefined,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const result = await getBlogBySlug(params.slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const blog = result.data;

  // Calculate reading time (average 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <article className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-100 max-h-150">
        <Image
          src={blog.imageUrl}
          alt={blog.h1}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            {blog.isPublished ? (
              <Badge className="mb-4">Published</Badge>
            ) : (
              <Badge variant="secondary" className="mb-4">
                Draft
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {blog.h1}
            </h1>

            {blog.imageCaption && (
              <p className="text-sm text-white/80 italic">
                {blog.imageCaption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="border-y bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              {blog.authorName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{blog.authorName}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(blog.createdAt), "MMM dd, yyyy")}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Summary */}
          {blog.Summary && (
            <div className="mb-8 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
              <p className="text-lg text-muted-foreground italic">
                {blog.Summary}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <Separator className="my-12" />

          {/* FAQs Section */}
          {blog.faqs && blog.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {blog.faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Schema Markup */}
          {blog.schema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: blog.schema }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
