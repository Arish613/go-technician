"use client";

import { useState, useMemo } from "react";
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, MoreHorizontal, Trash2, GripVertical, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

interface ProductTableProps {
    products: Product[];
    onRefresh?: () => void;
}

interface SortableRowProps {
    product: Product;
    onDelete: (id: string) => void;
}

function SortableRow({ product, onDelete }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : 0,
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="w-16">
                <button
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                </button>
            </TableCell>
            <TableCell className="w-20">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
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
                <div>
                    <p className="font-semibold">{product.name}</p>
                    {product.brand && (
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                    )}
                    {product.category?.slug === "buy-second-hand-air-conditioner" && product.starRating && (
                        <p className="text-sm text-blue-600 font-medium">
                            {product.starRating} Star AC
                        </p>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div>
                    <p className="font-semibold">₹{product.price}</p>
                    {product.discountPrice && (
                        <p className="text-sm text-green-600">₹{product.discountPrice}</p>
                    )}
                </div>
            </TableCell>
            <TableCell>
                {product.locality ? (
                    <Badge variant="secondary">{product.locality.name}, {product.locality.city?.name}</Badge>
                ) : product.city ? (
                    <Badge variant="secondary">{product.city.name}</Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )}
            </TableCell>
            <TableCell>
                {product.isAvailable ? (
                    <Badge variant="default">Available</Badge>
                ) : (
                    <Badge variant="secondary">Unavailable</Badge>
                )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
                {formatDate(product.createdAt)}
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
                            <Link href={`/admin/second-hand/product/update/${product.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(product.id)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

interface CategoryTableProps {
    products: Product[];
    categoryName: string;
    onDelete: (id: string) => void;
    onSaveOrder: (items: Product[]) => void;
}

function CategoryTable({ products, onDelete, onSaveOrder }: CategoryTableProps) {
    const [items, setItems] = useState<Product[]>(products);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                setHasChanges(true);
                return newItems;
            });
        }
    };

    const handleSaveOrder = async () => {
        setIsSaving(true);
        try {
            const orders = items.map((product, index) => ({
                id: product.id,
                order: index,
            }));

            const response = await fetch("/api/second-hand/product", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orders }),
            });

            if (response.ok) {
                setHasChanges(false);
                onSaveOrder(items);
            } else {
                const result = await response.json();
                alert(result.error || "Failed to save order");
            }
        } catch (error) {
            console.error("Save order error:", error);
            alert("An error occurred while saving order");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-2">
                <Button
                    onClick={handleSaveOrder}
                    disabled={!hasChanges || isSaving}
                    size="sm"
                    className={hasChanges ? "animate-pulse" : ""}
                >
                    <Save className="w-3 h-3 mr-1" />
                    {isSaving ? "Saving..." : "Save Order"}
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Order</TableHead>
                                    <TableHead className="w-20">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-6">
                                            <p className="text-muted-foreground text-sm">
                                                No products in this category
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((product) => (
                                        <SortableRow
                                            key={product.id}
                                            product={product}
                                            onDelete={onDelete}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const newArray = [...array];
    const [removed] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, removed);
    return newArray;
}

export function ProductTable({ products, onRefresh }: ProductTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const groupedProducts = useMemo(() => {
        const groups: Record<string, Product[]> = {};

        products.forEach((product) => {
            const categoryName = product.category?.name || "Uncategorized";
            if (!groups[categoryName]) {
                groups[categoryName] = [];
            }
            groups[categoryName].push(product);
        });

        Object.keys(groups).forEach((category) => {
            groups[category].sort((a, b) => (a.order || 0) - (b.order || 0));
        });

        return groups;
    }, [products]);

    const categories = useMemo(() => {
        return Object.keys(groupedProducts).sort();
    }, [groupedProducts]);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/second-hand/product/${deleteId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onRefresh?.();
            } else {
                const result = await response.json();
                alert(result.error || "Failed to delete product");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const handleCategoryOrderSaved = () => {
        onRefresh?.();
    };

    return (
        <>
            {products.length === 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">
                                    <p className="text-muted-foreground">
                                        No products found. Create your first product to get started.
                                    </p>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <Accordion type="multiple" className="w-full" defaultValue={categories}>
                    {categories.map((category) => (
                        <AccordionItem key={category} value={category}>
                            <AccordionTrigger className="hover:no-underline px-4 bg-muted/50 rounded-t-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-base font-semibold">{category}</span>
                                    <Badge variant="outline" className="ml-2">
                                        {groupedProducts[category].length} product
                                        {groupedProducts[category].length !== 1 ? "s" : ""}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 px-0">
                                <CategoryTable
                                    products={groupedProducts[category]}
                                    categoryName={category}
                                    onDelete={(id) => setDeleteId(id)}
                                    onSaveOrder={handleCategoryOrderSaved}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product.
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
