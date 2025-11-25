"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/src/libs/api";

const FILE_BASE =
  process.env.NEXT_PUBLIC_FILE_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "";

type Product = {
  id: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  imageFileName?: string | null;
  slug: string; // برای رفتن به صفحه‌ی جزئیات
};

type ProductsResponse = {
  total: number;
  page: number;
  pageSize: number;
  items: Product[];
};

function formatToman(value: number | null | undefined) {
  if (!value || value <= 0) return "—";
  return `${value.toLocaleString("fa-IR")} تومان`;
}

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ProductsResponse>("/products")
      .then((res) => setProducts(res.data.items))
      .catch((err) =>
        setError(err?.response?.data?.title || "خطا در دریافت محصولات")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.title || "خطا در حذف محصول");
    }
  }

  function goToDetail(slug: string) {
    router.push(`/products/${slug}`);
  }

  return (
    <main className="p-8 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🛒 محصولات</h1>
        <Link
          href="/products/new"
          className="px-4 py-2 rounded bg-black text-white"
        >
          + افزودن محصول
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">در حال بارگذاری…</p>
      ) : error ? (
        <div className="p-3 rounded bg-red-50 text-red-700">{error}</div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">هیچ محصولی ثبت نشده است.</p>
      ) : (
        <table className="w-full border text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">نام</th>
              <th className="p-2">قیمت</th>
              <th className="p-2">تخفیف</th>
              <th className="p-2">موجودی</th>
              <th className="p-2">عکس</th>
              <th className="p-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const imgSrc =
                p.imageFileName && FILE_BASE
                  ? `${FILE_BASE}/uploads/products/${p.imageFileName}`
                  : null;

              return (
                <tr
                  key={p.id}
                  className="border-t cursor-pointer hover:bg-gray-50"
                  onClick={() => goToDetail(p.slug)}
                >
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{formatToman(p.price)}</td>
                  <td className="p-2">
                    {p.discountPrice ? formatToman(p.discountPrice) : "—"}
                  </td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // نذار کلیک روی ردیف اجرا بشه
                        handleDelete(p.id);
                      }}
                      className="px-3 py-1 text-sm rounded bg-red-600 text-white"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
