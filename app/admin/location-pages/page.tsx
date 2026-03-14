"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, RefreshCw, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LocationPageItem {
  id: string;
  slug: string;
  serviceSlug: string;
  location: string;
  title: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  faqs: Array<{ id: string; question: string; answer: string }>;
}

export default function AdminLocationPagesPage() {
  const [pages, setPages] = useState<LocationPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/location-page");
      const result = await response.json();

      if (response.ok && result.data) {
        setPages(result.data);
      } else {
        setError(result.error || "Failed to fetch location pages");
      }
    } catch (err) {
      setError("An error occurred while fetching location pages");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/location-page/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (response.ok) {
        fetchPages();
      } else {
        alert("Failed to update publish status");
      }
    } catch {
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/location-page/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPages();
      } else {
        alert("Failed to delete location page");
      }
    } catch {
      alert("An error occurred");
    }
  };

  const formatLocation = (location: string) => {
    return location
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="md:mx-20 py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Location Pages</h1>
          <p className="text-muted-foreground mt-1">
            Manage location-specific service pages for SEO
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchPages}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Link href="/admin/location-pages/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Location Page
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground mt-2">
            Loading location pages...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchPages} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      ) : pages.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>FAQs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/service/${page.slug}`}
                      target="_blank"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {page.title}
                    </Link>
                  </TableCell>
                  <TableCell>{formatLocation(page.location)}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {page.serviceSlug}
                    </code>
                  </TableCell>
                  <TableCell>{page.faqs.length}</TableCell>
                  <TableCell>
                    <Badge
                      variant={page.isPublished ? "default" : "secondary"}
                    >
                      {page.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleTogglePublish(page.id, page.isPublished)
                        }
                        title={
                          page.isPublished ? "Unpublish" : "Publish"
                        }
                      >
                        {page.isPublished ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Link href={`/admin/location-pages/update/${page.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(page.id, page.title)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">
            No location pages found. Create your first one!
          </p>
          <Link href="/admin/location-pages/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Location Page
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
