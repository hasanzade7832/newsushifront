"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/src/libs/api";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  discountPrice?: number | null;
  sku: string;
  stock: number;
  slug: string;
  isActive: boolean;
};

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    api
      .get<Product>(`/products/by-slug/${slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.title || "Product not found");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!slug) {
    return <main className="p-8">Invalid slug.</main>;
  }

  if (loading) {
    return <main className="p-8 text-gray-500">Loading…</main>;
  }

  if (error || !product) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-gray-500">
          Slug: <code>{slug}</code>
        </p>
      </main>
    );
  }

  const p = product;

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">{p.name}</h1>
      <p className="text-gray-600">{p.description || "—"}</p>

      <div className="text-lg">
        Price: {p.price.toLocaleString()}{" "}
        {p.discountPrice ? (
          <span>(discount: {p.discountPrice.toLocaleString()})</span>
        ) : null}
      </div>

      <div>
        SKU: {p.sku} | Stock: {p.stock} | {p.isActive ? "✅ Active" : "—"}
      </div>
    </main>
  );
}
