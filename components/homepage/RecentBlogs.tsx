import { getRecentBlogs } from "@/lib/action/blog";
import { BlogCard } from "@/components/blog/Card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {result.data.map((blog) => (
                    <BlogCard key={blog.id} blog={{ ...blog, faqs: [] }} />
                ))}
            </div>
        </section>
    );
}