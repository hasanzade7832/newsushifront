// app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/libs/api";
import MenuHeader from "@/src/components/MenuHeader";

const FILE_BASE =
  process.env.NEXT_PUBLIC_FILE_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "";

type Product = {
  id: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  description?: string | null;
  stock: number;
  imageFileName?: string | null;
  slug?: string | null;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    api
      .get<ProductsResponse>("/products")
      .then((res) => setProducts(res.data.items))
      .catch((err) =>
        setError(err?.response?.data?.title || "خطا در دریافت محصولات")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 px-4 py-10 sm:px-8">
      {/* هدر منو */}
      <MenuHeader />

      {/* لیست محصولات */}
      <section className="mx-auto mt-14 max-w-6xl" dir="rtl">
        {loading ? (
          <p className="text-center text-2xl text-emerald-800">
            در حال بارگذاری…
          </p>
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-2xl bg-red-50 p-6 text-2xl text-red-700 text-center">
            {error}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-2xl text-emerald-800">
            هنوز هیچ محصولی ثبت نشده است.
          </p>
        ) : (
          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const imgSrc =
                p.imageFileName && FILE_BASE
                  ? `${FILE_BASE}/uploads/products/${p.imageFileName}`
                  : null;

              const effectiveSlug = p.slug || String(p.id);

              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/products/${effectiveSlug}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/products/${effectiveSlug}`);
                    }
                  }}
                  className="flex flex-col items-center text-center outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60 bg-transparent"
                >
                  {/* تصویر بزرگ */}
                  <div className="relative mt-4 flex items-center justify-center">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="
                          w-[320px] h-[260px]
                          sm:w-[360px] sm:h-[290px]
                          lg:w-[400px] lg:h-[320px]
                          xl:w-[420px] xl:h-[340px]
                          object-contain
                          drop-shadow-[0_40px_70px_rgba(0,0,0,0.40)]
                          transition-transform
                          duration-500
                          hover:-translate-y-2
                          hover:scale-[1.06]
                          select-none
                        "
                      />
                    ) : (
                      <div className="w-[320px] h-[260px] sm:w-[360px] sm:h-[290px] lg:w-[400px] lg:h-[320px] xl:w-[420px] xl:h-[340px] flex items-center justify-center rounded-[40px] bg-emerald-100/80 text-emerald-500 text-xl sm:text-2xl">
                        بدون تصویر
                      </div>
                    )}
                  </div>

                  {/* باکس متن زیر تصویر با بردر و سایه لطیف */}
                  <div className="mt-5 w-full max-w-md rounded-3xl border border-emerald-100/80 bg-white/80 px-6 py-5 text-center shadow-[0_20px_45px_rgba(16,185,129,0.12)]">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                      {p.name}
                    </h2>

                    <div className="mt-2 flex flex-col items-center gap-1 text-lg sm:text-xl">
                      <div className="flex items-baseline gap-3">
                        {p.discountPrice ? (
                          <>
                            <span className="text-emerald-700 font-bold">
                              {formatToman(p.discountPrice)}
                            </span>
                            <span className="text-gray-400 line-through text-sm sm:text-base">
                              {formatToman(p.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-emerald-700 font-bold">
                            {formatToman(p.price)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-emerald-700">
                        موجودی: {p.stock.toLocaleString("fa-IR")}
                      </span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-emerald-900/90">
                      {p.description
                        ? p.description
                        : "توضیحات این محصول هنوز ثبت نشده است، اما می‌توانید روی جزئیات محصول کلیک کنید تا اطلاعات بیشتری ببینید."}
                    </p>

                    <div className="mt-4 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${effectiveSlug}`);
                        }}
                        className="rounded-full bg-emerald-600 px-5 py-2 text-sm sm:text-base font-semibold text-white shadow-md shadow-emerald-300/60 transition-all hover:bg-emerald-700 hover:shadow-lg"
                      >
                        جزئیات محصول
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
