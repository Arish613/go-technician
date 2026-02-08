import { getRecentBlogs } from "@/lib/action/blog";
import { BlogCard } from "@/components/blog/Card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export async function RecentBlogs() {
    const result = await getRecentBlogs(3);

    if (!result.success || !result.data || result.data.length === 0) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 px-4 md:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Latest Blogs</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Stay updated with our latest tips and insights
                    </p>
                </div>
                <Link
                    href="/blog"
                    className="flex items-center gap-2 text-primary font-semibold hover:underline text-sm md:text-base w-fit"
                >
                    View all
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="relative px-2 md:px-12">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {result.data.map((blog, idx) => (
                            <CarouselItem
                                key={blog.id}
                                className="pl-4 basis-3/3 md:basis-1/3 lg:basis-1/3"
                            >
                                <BlogCard blog={{ ...blog, faqs: [] }} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
                    <CarouselNext className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
                </Carousel>
            </div>
        </section>
    );
}