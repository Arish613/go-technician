import { BlogForm } from "@/components/blog/Form";

export default function AddBlogPage() {
  return (
    <div className="md:mx-20 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
      <BlogForm mode="create" />
    </div>
  );
}