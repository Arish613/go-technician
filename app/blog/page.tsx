import { getBlogs } from "@/lib/action/blog";
import { BlogCard } from "@/components/blog/Card";

export const metadata = {
  title: "Blog | Go Technicians",
  description: "Read our latest articles, guides, and technical insights",
};

export default async function BlogsPage() {
  const result = await getBlogs(true); // Only published blogs

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground">
            {result.error || "No blogs available"}
          </p>
        </div>
      </div>
    );
  }

  const blogs = result.data;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div>
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore articles, guides, and insights from our experts
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className=" px-4 py-5 md:mx-20">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {blogs.length} {blogs.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No published blogs yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
