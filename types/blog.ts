import { Blog, Faq } from "@prisma/client";

export type BlogType = Blog;

export type BlogWithFaqs = Blog & {
  faqs: Faq[];
};

export type CreateBlogInput = {
  h1: string;
  title?: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  imageUrl: string;
  imageCaption?: string;
  content: string;
  authorName?: string;
  Summary?: string;
  schema?: string;
  canonicalUrl?: string;
  isPublished?: boolean;
  faqs?: {
    question: string;
    answer: string;
  }[];
};

export type UpdateBlogInput = Partial<CreateBlogInput> & {
  id: string;
};

export type BlogListItem = Pick<
  Blog,
  "id" | "h1" | "slug" | "imageUrl" | "Summary" | "isPublished" | "createdAt" | "updatedAt" | "authorName"
>;

export type BlogCard = {
  id: string;
  h1: string;
  slug: string;
  imageUrl: string;
  imageCaption?: string;
  Summary?: string;
  createdAt: Date;
};
