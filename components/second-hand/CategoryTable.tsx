"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/product";

interface CategoryTableProps {
  categories: Category[];
  onRefresh?: () => void;
}

export function CategoryTable({ categories, onRefresh }: CategoryTableProps) {
  const router = useRouter();
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteSlug) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/second-hand/category/${deleteSlug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh?.();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
      setDeleteSlug(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <p className="text-muted-foreground">
                    No categories found. Create your first category to get started.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-20 h-15 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <p className="font-semibold">{category.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.slug}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {category.metaTitle ? (
                      <p className="truncate">{category.metaTitle}</p>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {category.isVisible ? (
                      <Badge variant="default">Visible</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(category.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/second-hand/category/update/${category.slug}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteSlug(category.slug)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteSlug} onOpenChange={() => setDeleteSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and all associated products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}