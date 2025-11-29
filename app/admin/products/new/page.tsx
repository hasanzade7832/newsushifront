// app/admin/products/new/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Product,
  PagedProducts,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/src/libs/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const UPLOAD_BASE = API_BASE.replace(/\/api\/?$/, "");

export default function AdminProductsPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState<string>("0");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const imageFromServer = useMemo(() => {
    if (!editingProduct?.imageFileName) return null;
    return `${UPLOAD_BASE}/uploads/products/${editingProduct.imageFileName}`;
  }, [editingProduct]);

  const loadProducts = () => {
    setLoadingList(true);
    getProducts(1, 100)
      .then((res: PagedProducts) => {
        setProducts(res.items);
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("0");
    setDiscountPrice("");
    setSku("");
    setStock("0");
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description ?? "");
    setPrice(String(p.price));
    setDiscountPrice(
      p.discountPrice != null ? String(p.discountPrice) : ""
    );
    setSku(p.sku);
    setStock(String(p.stock));
    setIsActive(p.isActive);
    setImageFile(null);
    setImagePreview(null);
    setSuccess(null);
    setError(null);
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`حذف محصول «${p.name}»؟`)) return;
    setDeletingId(p.id);
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err: any) {
      console.error(err);
      alert("حذف محصول با خطا مواجه شد.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const form = new FormData();
      form.append("Name", name);
      form.append("Description", description);
      form.append("Price", price || "0");
      if (discountPrice) form.append("DiscountPrice", discountPrice);
      form.append("Sku", sku);
      form.append("Stock", stock || "0");
      form.append("IsActive", isActive ? "true" : "false");

      if (imageFile) {
        form.append("image", imageFile);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
        setSuccess("محصول با موفقیت ویرایش شد.");
      } else {
        const created = await createProduct(form);
        setSuccess("محصول جدید با موفقیت افزوده شد.");
        setProducts((prev) => [created, ...prev]);
      }

      // برای ویرایش، لیست را دوباره بخوانیم تا همه چیز sync شود
      if (editingProduct) {
        loadProducts();
      }

      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "ذخیره محصول با خطا مواجه شد."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-5xl bg-slate-900/85 border border-slate-800 rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* فرم محصول */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold">
              {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
            </h2>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-slate-300 hover:text-sky-400"
              >
                لغو و ساخت محصول جدید
              </button>
            )}
          </div>

          {success && (
            <div className="rounded-lg border border-emerald-400/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {success}
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                نام محصول
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                توضیحات
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  قیمت
                </label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  SKU
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  موجودی
                </label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
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
                className="text-sm font-semibold text-slate-300"
              >
                محصول فعال باشد
              </label>
            </div>
          </div>

          {/* آپلودر تصویر + پیش‌نمایش */}
          <div className="mt-2 space-y-2">
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              تصویر محصول
            </label>
            <div className="flex gap-3 items-start">
              <label className="flex-1 cursor-pointer border-2 border-dashed border-slate-600 hover:border-emerald-400 bg-slate-950/60 rounded-2xl px-4 py-4 flex flex-col items-center justify-center text-sm text-slate-300">
                <span className="font-bold mb-1">انتخاب تصویر</span>
                <span className="text-xs text-slate-500">
                  روی اینجا کلیک کنید یا فایل را بکشید و رها کنید
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageChange(
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
              </label>

              <div className="w-28 h-28 rounded-2xl border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="پیش‌نمایش"
                    className="w-full h-full object-cover"
                  />
                ) : imageFromServer ? (
                  <img
                    src={imageFromServer}
                    alt={editingProduct?.name ?? "محصول"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] text-slate-500 text-center px-2">
                    بدون تصویر
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-sm font-extrabold text-slate-900 transition disabled:opacity-60"
            >
              {saving
                ? "در حال ذخیره..."
                : editingProduct
                ? "ذخیره تغییرات"
                : "افزودن محصول"}
            </button>
          </div>
        </form>

        {/* لیست محصولات */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col gap-3">
          <h3 className="text-xl font-bold mb-1">
            لیست محصولات
          </h3>

          {loadingList ? (
            <p className="text-sm text-slate-300 text-center">
              در حال بارگذاری محصولات...
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-slate-300 text-center">
              هنوز محصولی ثبت نشده است.
            </p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[11px] text-slate-300 overflow-hidden">
                      {p.imageFileName ? (
                        <img
                          src={`${UPLOAD_BASE}/uploads/products/${p.imageFileName}`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        p.name.slice(0, 2)
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-xs text-slate-400">
                        {p.sku} • موجودی: {p.stock}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                        p.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50"
                          : "bg-slate-700/40 text-slate-200 border border-slate-500/60"
                      }`}
                    >
                      {p.isActive ? "فعال" : "غیرفعال"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEditProduct(p)}
                      className="px-3 py-1 rounded-full bg-sky-500 hover:bg-sky-400 text-[11px] font-bold text-slate-900"
                    >
                      ویرایش
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === p.id}
                      onClick={() => handleDeleteProduct(p)}
                      className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-400 text-[11px] font-bold text-slate-50 disabled:opacity-60"
                    >
                      {deletingId === p.id ? "حذف..." : "حذف"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
