// app/products/page.tsx
"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/libs/api";
import MenuHeaderText from "@/src/components/MenuHeader";
import { FiSearch } from "react-icons/fi";
import UserMenu from "@/src/components/UserMenu";

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

  // انیمیشن ورود کل صفحه
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 700);
    return () => clearTimeout(t);
  }, []);

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
      {/* نوار لودینگ بالا */}
      {showSplash && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
          <div className="h-1 bg-slate-900/90 animate-pulse" />
        </div>
      )}

      {/* کل محتوا با انیمیشن از بالا */}
      <div
        className={`transition-all duration-700 ${
          showSplash ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* هدر: پروفایل + سرچ + لوگو + منو */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl">
          <div className="w-full px-3 sm:px-6 pt-6 pb-3">
            <div className="flex items-center justify-between gap-6" dir="ltr">
              {/* چپ: پروفایل + سرچ */}
              <div className="flex flex-1 items-center justify-start gap-4">
                <UserMenu />

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
                        focus:placeholder-transparent
                        outline-none
                        border-b-[3px]
                        border-dotted
                        border-sky-400
                      "
                    />
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

              {/* راست: لوگو چسبیده به راست */}
              <div className="shrink-0 pr-1 sm:pr-2 font-extrabold text-2xl text-slate-800">
                LoGo
              </div>
            </div>
          </div>

          <div className="mt-4">
            <MenuHeaderText />
          </div>
          <div className="h-px w-full bg-slate-200/80" />
        </header>

        {/* لیست محصولات */}
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
            <div className="grid gap-16.sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* --- کارت محصول با انیمیشن اسکرول + انیمیشن توضیحات + دایره دنبال‌کننده موس --- */

type ProductCardProps = {
  product: Product;
  index: number;
};

function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // برای دایره‌ی دنبال‌کننده موس
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // هر بار وارد/خارج دید می‌شود، visible را آپدیت کن
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const imgSrc =
    product.imageFileName && FILE_BASE
      ? `${FILE_BASE}/uploads/products/${product.imageFileName}`
      : null;

  const effectiveSlug = product.slug || String(product.id);

  // حرکت موس روی ناحیه تصویر
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // inside box
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  const handleMouseLeave = () => {
    setCursorPos(null);
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/products/${effectiveSlug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/products/${effectiveSlug}`);
        }
      }}
      className={`
        group
        flex flex-col items-center
        text-center
        outline-none
        focus-visible:ring-4 focus-visible:ring-slate-300
        bg-transparent
        transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      style={{
        transitionDelay: `${(index % 3) * 80}ms`,
      }}
    >
      {/* تصویر + دایره دنبال‌کننده موس + فلش */}
      <div
        className="
          relative
          flex items-center justify-center
          cursor-pointer
        "
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={product.name}
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

        {/* 🔵 دایره لطیف دنبال‌کننده موس با بک‌گراند خاکستری کم‌رنگ */}
        <span
          className="
            pointer-events-none
            absolute
            rounded-full
            border border-sky-400/90
            bg-slate-200/50
            shadow-[0_0_0_1px_rgba(255,255,255,0.7)]
          "
          style={{
            width: "68px",
            height: "68px",
            left: cursorPos ? `${cursorPos.x}px` : "50%",
            top: cursorPos ? `${cursorPos.y}px` : "50%",
            transform: cursorPos
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.2)",
            opacity: cursorPos ? 1 : 0,
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        />

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
          {product.name}
        </h2>

        <div className="mt-1 text-base sm:text-lg font-bold text-sky-700">
          {formatToman(product.discountPrice ?? product.price)}
        </div>

        {/* توضیحات: بولد + انیمیشن کج → صاف بر اساس visible */}
        <p
          className={`
            mt-3
            text-xs sm:text-sm
            leading-relaxed
            text-slate-900
            font-bold
            transition-all duration-700 ease-out
            origin-right
            ${
              visible
                ? "opacity-100 translate-y-0 skew-y-0"
                : "opacity-0 translate-y-6 -skew-y-12"
            }
          `}
        >
          {product.description
            ? product.description
            : "توضیحات این محصول هنوز ثبت نشده است، اما می‌توانید روی جزئیات محصول کلیک کنید تا اطلاعات بیشتری ببینید."}
        </p>

        <div className="mt-5 flex.items-center justify-center">
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
              transition-all.duration-300 ease-out
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
}
