// app/admin/products/new/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/src/libs/api";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discountPrice, setDiscountPrice] = useState<number | "">("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Description", description);
      formData.append("Price", String(price || 0));
      if (discountPrice !== "" && discountPrice != null) {
        formData.append("DiscountPrice", String(discountPrice));
      }
      formData.append("Sku", sku);
      formData.append("Stock", String(stock || 0));
      formData.append("IsActive", String(isActive));
      if (slug.trim()) {
        formData.append("Slug", slug.trim());
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const product = await createProduct(formData);

      setSuccess(`محصول "${product.name}" با موفقیت ثبت شد.`);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError("دسترسی ادمین لازم است. لطفاً دوباره وارد شوید.");
      } else {
        setError(
          err?.response?.data?.title ||
            err?.response?.data?.message ||
            "ثبت محصول ناموفق بود."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4"
      >
        <h2 className="text-xl font-extrabold mb-2 text-center">
          افزودن محصول جدید
        </h2>

        {error && (
          <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              نام محصول
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              اسلاگ (اختیاری)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              قیمت
            </label>
            <input
              type="number"
              min={0}
              required
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              قیمت با تخفیف (اختیاری)
            </label>
            <input
              type="number"
              min={0}
              value={discountPrice}
              onChange={(e) =>
                setDiscountPrice(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              SKU
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              موجودی
            </label>
            <input
              type="number"
              min={0}
              required
              value={stock}
              onChange={(e) =>
                setStock(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              توضیحات
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              تصویر محصول (اختیاری)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
              }}
              className="w-full text-xs text-slate-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-400 focus:ring-emerald-400"
            />
            <label
              htmlFor="isActive"
              className="text-xs font-semibold text-slate-300"
            >
              محصول فعال باشد
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-100 transition"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-xs font-extrabold text-slate-900 transition disabled:opacity-60"
          >
            {loading ? "در حال ثبت..." : "ثبت محصول"}
          </button>
        </div>
      </form>
    </section>
  );
}
