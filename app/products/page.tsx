// app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/libs/api";
import MenuHeaderText from "@/src/components/MenuHeader";
import { FiSearch } from "react-icons/fi";

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
      {/* هدر بالا: سرچ + لوگو + منو متنی */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl">
        {/* ردیف سرچ (چپ) + لوگو (راست) */}
        <div className="mx-auto max-w-[90rem] px-8 pt-6 pb-3">
          <div className="flex items-center justify-between gap-8" dir="ltr">
            {/* سرچ سمت چپ با خط نقطه‌چین زیرش */}
            <div className="flex-1 flex items-center justify-start">
              <div className="flex flex-col items-stretch w-full">
                <div className="relative w-full max-w-[64rem]">
                  <input
                    type="text"
                    placeholder="TYPE WHAT YOU ARE LOOKING FOR"
                    className="
                w-full
                bg-transparent
                pb-1
                pr-0
                pl-0
                text-xs sm:text-sm
                font-bold
                uppercase
                tracking-[0.3em]
                text-sky-300
                placeholder:text-sky-300
                focus:placeholder-transparent  /* روی فوکوس، placeholder محو شود */
                outline-none
                border-b-[3px]
                border-dotted
                border-sky-400
              "
                  />
                  {/* آیکون سرچ از react-icons با رنگ آبی */}
                  <FiSearch
                    aria-hidden="true"
                    className="
                absolute
                right-0
                top-1/2
                -translate-y-1/2
                text-[22px]
                text-sky-400
              "
                  />
                </div>
              </div>
            </div>

            {/* لوگو سمت راست */}
            <div className="shrink-0 font-extrabold text-2xl text-slate-800">
              LoGo
            </div>
          </div>
        </div>

        {/* منو متنی سبز/آبی با فاصله‌ی بیشتر از سرچ */}
        <div className="mt-4">
          <MenuHeaderText />
        </div>

        {/* خط زیر منو – تمام عرض */}
        <div className="h-px w-full bg-slate-200/80" />
      </header>

      {/* --- لیست محصولات (بدون تغییر نسبت به نسخه‌ی قبلی) --- */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-8 pb-16" dir="rtl">
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
                  className="
                    group
                    flex flex-col items-center
                    text-center
                    outline-none
                    focus-visible:ring-4 focus-visible:ring-slate-300
                    bg-transparent
                  "
                >
                  {/* تصویر + فلش خمیده */}
                  <div className="relative flex items-center justify-center">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="
                          w-[260px] h-[220px]
                          sm:w-[280px] sm:h-[240px]
                          lg:w-[300px] lg:h-[260px]
                          xl:w-[320px] xl:h-[280px]
                          object-contain
                          drop-shadow-[0_40px_70px_rgba(0,0,0,0.40)]
                          transition-transform
                          duration-500
                          group-hover:-translate-y-2
                          group-hover:scale-[1.04]
                          select-none
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-[260px] h-[220px]
                          sm:w-[280px] sm:h-[240px]
                          lg:w-[300px] lg:h-[260px]
                          xl:w-[320px] xl:h-[280px]
                          flex items-center justify-center
                          rounded-[40px]
                          bg-slate-100 text-slate-500 text-xl sm:text-2xl
                        "
                      >
                        بدون تصویر
                      </div>
                    )}

                    <svg
                      className="
                        hidden md:block
                        absolute
                        -bottom-6
                        left-4
                        h-14 w-24
                        text-emerald-700
                        pointer-events-none
                      "
                      viewBox="0 0 64 64"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M46 8C40 14 28 24 22 38C19 45 19 52 21 60"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16 55 L19 63 L28 58"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="rotate(-30 22 59)"
                      />
                    </svg>
                  </div>

                  <div className="mt-10 max-w-xs text-center">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-900">
                      {p.name}
                    </h2>

                    <div className="mt-1 text-base sm:text-lg font-bold text-sky-700">
                      {formatToman(p.discountPrice ?? p.price)}
                    </div>

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700">
                      {p.description
                        ? p.description
                        : "توضیحات این محصول هنوز ثبت نشده است، اما می‌توانید روی جزئیات محصول کلیک کنید تا اطلاعات بیشتری ببینید."}
                    </p>

                    <div className="mt-5 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${effectiveSlug}`);
                        }}
                        className="
                          relative overflow-hidden
                          rounded-full px-6 py-2
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
