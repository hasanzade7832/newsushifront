"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/libs/api";

export default function NewProductPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError(null);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      description: String(formData.get("description") || "") || null,
      price: Number(formData.get("price") || 0),
      discountPrice: formData.get("discountPrice")
        ? Number(formData.get("discountPrice"))
        : null,
      sku: String(formData.get("sku") || "").trim(),
      stock: Number(formData.get("stock") || 0),
      isActive: formData.get("isActive") === "on",
      slug: String(formData.get("slug") || "") || null, // اختیاری
    };

    try {
      await api.post("/products", payload);
      router.push("/products");
    } catch (e: any) {
      setError(e?.response?.data?.title || "Failed to create product");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">➕ New Product</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>
      )}

      <form action={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name *</label>
          <input name="name" required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Price *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Discount Price</label>
            <input
              name="discountPrice"
              type="number"
              step="0.01"
              min="0"
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">SKU *</label>
            <input name="sku" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock *</label>
            <input
              name="stock"
              type="number"
              min="0"
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Slug (optional)</label>
            <input
              name="slug"
              className="w-full border rounded p-2"
              placeholder="e.g. salmon-nigiri"
            />
          </div>
          <label className="flex items-end gap-2">
            <input name="isActive" type="checkbox" defaultChecked />
            <span>Active</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            disabled={busy}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
