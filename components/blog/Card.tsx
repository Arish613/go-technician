import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { BlogWithFaqs } from "@/types/blog";

interface BlogCardProps {
  blog: BlogWithFaqs;
}

export function BlogCard({ blog }: BlogCardProps) {
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/blog/${blog.slug}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="relative w-full h-56 overflow-hidden bg-muted">
            <Image
              src={blog.imageUrl}
              alt={blog.h1}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/80">
              {blog.authorName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                  <User className="w-3 h-3" />
                  {blog.authorName}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                <Calendar className="w-3 h-3" />
                {format(new Date(blog.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 py-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
              <Clock className="w-3 h-3" />
              {readingTime} min read
            </span>
          </div>

          <h3 className="text-2xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {blog.h1}
          </h3>

          {blog.Summary && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {blog.Summary}
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            Read more
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
