import { getBlogBySlug, getBlogs } from "@/lib/action/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Share2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

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
      canonical: `/blog/${blog.slug}`,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const blog = result.data;

  // Get recent blogs
  const recentBlogsResult = await getBlogs(true);
  const recentBlogs = recentBlogsResult.success
    ? (recentBlogsResult.data ?? []).filter((b) => b.id !== blog.id).slice(0, 3)
    : [];

  // Calculate reading time (average 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <article className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Main Content */}
          <div className="min-w-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {blog.authorName && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {blog.authorName}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.h1}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-100 rounded-xl overflow-hidden mb-8">
              <Image
                src={blog.imageUrl}
                alt={blog.h1}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
              {blog.imageCaption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3">
                  <p className="text-sm text-white italic">
                    {blog.imageCaption}
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            {blog.Summary && (
              <div className="mb-8 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                <p className="text-lg text-muted-foreground italic">
                  {blog.Summary}
                </p>
              </div>
            )}

            {/* Blog Content */}
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
                    <AccordionItem
                      key={faq.id}
                      value={`faq-${index}`}
                      className="border rounded-lg px-6 bg-card"
                    >
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
          </div>

          {/* Sidebar - Recent Posts */}
          <aside className="space-y-6">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">Recent Posts</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentBlogs.length > 0 ? (
                    recentBlogs.map((recentBlog) => (
                      <Link
                        key={recentBlog.id}
                        href={`/blog/${recentBlog.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={recentBlog.imageUrl}
                              alt={recentBlog.h1}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {recentBlog.h1}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(
                                new Date(recentBlog.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent posts
                    </p>
                  )}
                  <Link href="/blog">
                    <Button variant="outline" className="w-full" size="sm">
                      View All Posts
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
      <section className="py-12 md:py-16 bg-primary text-primary-foreground mt-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enjoyed this article?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Get in touch with our experts or explore more insightful blogs to stay updated!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" prefetch={true}>
              <Button size="lg" variant="secondary">
                Contact Us
              </Button>
            </Link>

          </div>
        </div>
      </section>
      {/* Schema Markup */}
      {blog.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: blog.schema }}
        />
      )}
    </article>
  );
}
