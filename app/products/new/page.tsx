"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/libs/api";

export default function NewProductPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [price, setPrice] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");

  function formatPreview(value: string) {
    const num = Number(value || 0);
    if (!num) return "۰ تومان";
    const formatted = num.toLocaleString("fa-IR");
    const thousands = (num / 1000).toLocaleString("fa-IR");
    return `${formatted} تومان (${thousands} هزار تومان)`;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    // یک SKU مخفی برای این‌که بک‌اند راضی باشد
    if (!formData.get("sku")) {
      formData.set("sku", `AUTO-${Date.now()}`);
    }

    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/products");
    } catch (err: any) {
      setError(err?.response?.data?.title || "خطا در ایجاد محصول");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">➕ محصول جدید</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {/* نام محصول */}
        <div>
          <label className="block text-sm mb-1">نام محصول *</label>
          <input
            name="name"
            required
            className="w-full border rounded p-2 text-right"
          />
        </div>

        {/* قیمت */}
        <div>
          <label className="block text-sm mb-1">قیمت (تومان) *</label>
          <input
            name="price"
            type="number"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2 text-left"
          />
          <p className="mt-1 text-xs text-gray-600">{formatPreview(price)}</p>
        </div>

        {/* تخفیف */}
        <div>
          <label className="block text-sm mb-1">قیمت با تخفیف (تومان)</label>
          <input
            name="discountPrice"
            type="number"
            min="0"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full border rounded p-2 text-left"
          />
          {discountPrice && (
            <p className="mt-1 text-xs text-gray-600">
              {formatPreview(discountPrice)}
            </p>
          )}
        </div>

        {/* موجودی */}
        <div>
          <label className="block text-sm mb-1">موجودی *</label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            className="w-full border rounded p-2 text-left"
          />
        </div>

        {/* آپلود عکس */}
        <div>
          <label className="block text-sm mb-1">عکس محصول</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full border rounded p-2 bg-white"
          />
        </div>

        {/* فیلدهای مخفی برای راضی‌کردن بک‌اند */}
        <input type="hidden" name="sku" value="" />
        <input type="hidden" name="description" value="" />
        <input type="hidden" name="slug" value="" />
        <input type="hidden" name="isActive" value="true" />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {busy ? "در حال ذخیره..." : "ذخیره"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-4 py-2 rounded border"
          >
            انصراف
          </button>
        </div>
      </form>
    </main>
  );
}
