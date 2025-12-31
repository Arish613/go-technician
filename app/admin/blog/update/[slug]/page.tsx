import { BlogForm } from "@/components/blog/Form";
import { getBlogById } from "@/lib/action/blog";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getBlogById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <BlogForm blog={result.data} mode="edit" />
    </div>
  );
}
