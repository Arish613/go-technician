import { getBlogs } from "@/lib/action/blog";
import { BlogsTable } from "@/components/blog/BlogTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminBlogsPage() {
  const result = await getBlogs();

  return (
    <div className="md:mx-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Link href="/admin/blog/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        </Link>
      </div>

      {result.success && result.data ? (
        <BlogsTable blogs={result.data} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {result.error || "No blogs found"}
          </p>
        </div>
      )}
    </div>
  );
}
