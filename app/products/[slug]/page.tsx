// app/products/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug, Product } from "@/src/libs/api";

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

    getProductBySlug(slug as string)
      .then((p) => setProduct(p))
      .catch((err: any) => {
        console.error(err);
        setError(
          err?.response?.data?.title ||
            err?.response?.data?.message ||
            "Product not found"
        );
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

  const imageUrl = p.imageFileName
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace(
        "/api",
        ""
      )}/uploads/products/${p.imageFileName}`
    : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8 flex flex-col md:flex-row gap-8">
      {imageUrl && (
        <div className="w-full md:w-1/3 flex items-start justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={p.name}
            className="rounded-3xl border border-slate-800 max-h-[380px] object-cover"
          />
        </div>
      )}

      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="text-gray-300">{p.description || "—"}</p>

        <div className="text-lg">
          قیمت: {p.price.toLocaleString("fa-IR")} تومان{" "}
          {p.discountPrice ? (
            <span className="text-emerald-300">
              (با تخفیف: {p.discountPrice.toLocaleString("fa-IR")} تومان)
            </span>
          ) : null}
        </div>

        <div className="text-sm text-gray-400">
          کد: {p.sku} | موجودی: {p.stock} |{" "}
          {p.isActive ? "✅ فعال" : "⛔️ غیرفعال"}
        </div>
      </div>
    </main>
  );
}
