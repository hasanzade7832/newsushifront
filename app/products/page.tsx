"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/src/libs/api";

type Product = {
  id: number;
  name: string;
  price: number;
  slug: string;
  sku: string;
  stock: number;
  isActive: boolean;
};

type ProductsResponse = {
  total: number;
  page: number;
  pageSize: number;
  items: Product[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ProductsResponse>("/products")
      .then((res) => setProducts(res.data.items))
      .catch((err) => setError(err?.response?.data?.title || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🛒 Products</h1>
        <Link
          href="/products/new"
          className="px-4 py-2 rounded bg-black text-white"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : error ? (
        <div className="p-3 rounded bg-red-50 text-red-700">{error}</div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Slug</th>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Stock</th>
              <th className="p-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="p-2">{p.slug || "—"}</td>
                <td className="p-2">{p.sku}</td>
                <td className="p-2 text-right">
                  {Number(p.price).toLocaleString()}
                </td>
                <td className="p-2 text-right">{p.stock}</td>
                <td className="p-2 text-center">{p.isActive ? "✅" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
