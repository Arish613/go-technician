import { BlogForm } from "@/components/blog/Form";
import { getBlogBySlug } from "@/lib/action/blog";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getBlogBySlug(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="md:mx-20 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <BlogForm blog={result.data} mode="edit" />
    </div>
  );
}
