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
    <main className="relative min-h-screen bg-white">
      {/* هدر بالا: لوگو + سرچ + خط‌ها + منو */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl">
        {/* ردیف لوگو + سرچ؛ الان هم‌عرض اسلایدر */}
        <div className="mx-auto max-w-[90rem] px-6 pt-4 pb-2" dir="rtl">
          <div className="flex items-center gap-6">
            {/* لوگو */}
            <div className="shrink-0 font-extrabold text-2xl text-slate-800">
              LoGo
            </div>

            {/* سرچ شیشه‌ای کنار لوگو */}
            <div className="flex-1">
              <div
                className="
                  relative
                  rounded-full
                  bg-slate-100/70
                  border border-slate-200/70
                  shadow-sm shadow-slate-200/80
                  backdrop-blur-md
                "
              >
                <input
                  type="text"
                  placeholder="جستجوی محصول..."
                  className="
                    w-full rounded-full
                    bg-transparent
                    outline-none
                    px-4 pr-4 pl-11
                    py-2.5
                    text-sm sm:text-base
                    text-slate-800
                    placeholder:text-slate-400
                    text-right
                  "
                />
                <span
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-slate-400 text-lg
                  "
                >
                  🔍
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* خط زیر لوگو و سرچ – تمام عرض */}
        <div className="mt-3 h-px w-full bg-slate-200/80" />

        {/* منوها */}
        <div>
          <MenuHeader />
        </div>

        {/* خط زیر منو – تمام عرض */}
        <div className="h-px w-full bg-slate-200/80" />
      </header>

      {/* لیست محصولات (مثل قبل) */}
      <section
        className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 pb-12"
        dir="rtl"
      >
        {loading ? (
          <p className="text-center text-2xl text-slate-800">
            در حال بارگذاری…
          </p>
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-2xl bg-red-50 p-6 text-2xl text-red-700 text-center">
            {error}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-2xl text-slate-800">
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
                  className="flex flex-col items-center text-center outline-none focus-visible:ring-4 focus-visible:ring-slate-300 bg-transparent"
                >
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
                      <div
                        className="
                          w-[320px] h-[260px]
                          sm:w-[360px] sm:h-[290px]
                          lg:w-[400px] lg:h-[320px]
                          xl:w-[420px] xl:h-[340px]
                          flex items-center justify-center
                          rounded-[40px]
                          bg-slate-100 text-slate-500 text-xl sm:text-2xl
                        "
                      >
                        بدون تصویر
                      </div>
                    )}
                  </div>

                  <div
                    className="
                      mt-5 w-full max-w-md
                      rounded-[32px]
                      border border-white/70
                      bg-gradient-to-b
                        from-slate-100/95
                        via-slate-100/80
                        to-slate-200/70
                      backdrop-blur-2xl
                      px-7 py-6
                      text-center
                      shadow-[0_40px_70px_rgba(0,0,0,0.40)]
                    "
                  >
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {p.name}
                    </h2>

                    <div className="mt-2 flex flex-col items-center gap-1 text-lg sm:text-xl">
                      <div className="flex items-baseline gap-3">
                        {p.discountPrice ? (
                          <>
                            <span className="text-slate-900 font-bold">
                              {formatToman(p.discountPrice)}
                            </span>
                            <span className="text-slate-500 line-through text-sm sm:text-base">
                              {formatToman(p.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-900 font-bold">
                            {formatToman(p.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-800/90">
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
                        className="
                          relative overflow-hidden
                          rounded-full px-5 py-2
                          text-sm sm:text-base font-semibold text-white
                          cursor-pointer
                          bg-gradient-to-l from-slate-700 via-slate-600 to-slate-700
                          bg-[length:200%_100%] bg-right
                          shadow-md shadow-slate-400/60
                          transition-all duration-300 ease-out
                          hover:bg-left
                          hover:shadow-lg hover:-translate-y-0.5
                        "
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
