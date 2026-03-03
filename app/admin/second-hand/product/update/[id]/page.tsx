"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/second-hand/ProductForm";
import type { Product, Category } from "@/types/product";

export default function UpdateProduct() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Pick<Category, "id" | "name">[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [prodRes, catRes] = await Promise.all([
                fetch(`/api/second-hand/product/${id}`),
                fetch("/api/second-hand/category"),
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            setProduct(prodData.data || null);
            setCategories((catData.data || []).map((c: Category) => ({ id: c.id, name: c.name })));
            setLoading(false);
        }
        fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="max-w-xl mx-auto py-8">
            <ProductForm mode="update" product={product} categories={categories} />
        </div>
    );
}