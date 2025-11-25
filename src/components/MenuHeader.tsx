"use client";

import { useEffect, useState } from "react";
import "./MenuHeader.css";

const CATEGORIES = [
  "همه",
  "سوشی کلاسیک",
  "سوشی ویژه",
  "سوشی مرغ و گوشت",
  "سوشی سبزیجات",
  "رول‌های خاص",
  "سالاد",
  "نوشیدنی",
  "پیش‌غذا",
  "غذای گرم",
  "دسر",
  "غذاهای ترکیبی",
];

export default function MenuHeader() {
  const [active, setActive] = useState<string>("سوشی ویژه");

  const [visibleCats, setVisibleCats] = useState<string[]>(CATEGORIES);
  const [overflowCats, setOverflowCats] = useState<string[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCats, setModalCats] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState<string>("");

  // محاسبه‌ی تعداد آیتم‌های قابل نمایش روی نوار بالایی
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;

      const width = window.innerWidth;

      // موبایل: فقط منوی همبرگری
      if (width < 768) {
        setIsDesktop(false);
        setVisibleCats([]);
        setOverflowCats([]);
        return;
      }

      setIsDesktop(true);

      // ریسپانسیو دقیق برای تعداد آیتم‌ها
      let maxVisible: number;

      if (width >= 1800) maxVisible = 13;
      else if (width >= 1600) maxVisible = 12;
      else if (width >= 1440) maxVisible = 11;
      else if (width >= 1280) maxVisible = 10;
      else if (width >= 1150) maxVisible = 9;
      else if (width >= 1024) maxVisible = 8;
      else if (width >= 900) maxVisible = 7;
      else maxVisible = 6; // کمترین مقدار روی دسکتاپ کوچک

      if (CATEGORIES.length <= maxVisible) {
        setVisibleCats(CATEGORIES);
        setOverflowCats([]);
      } else {
        setVisibleCats(CATEGORIES.slice(0, maxVisible));
        setOverflowCats(CATEGORIES.slice(maxVisible));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function openModal(categories: string[], title: string) {
    setModalCats(categories);
    setModalTitle(title);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const hasOverflow = overflowCats.length > 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div
          className="flex w-full items-center justify-between px-4 py-3 sm:px-6"
          dir="rtl"
        >
          {/* لوگو چسبیده به سمت راست */}
          <div className="flex items-center gap-2 text-emerald-900">
            <span className="text-xl font-extrabold sm:text-2xl">LoGo</span>
          </div>

          {/* نوار منو روی دسکتاپ */}
          {isDesktop && (
            <nav className="flex flex-1 items-center justify-center">
              <ul className="flex items-center gap-4 sm:gap-6">
                {visibleCats.map((cat) => {
                  const isActive = active === cat;
                  return (
                    <li key={cat} className="whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setActive(cat)}
                        className={[
                          "rounded-full px-5 py-2 text-sm sm:text-base font-semibold transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                          isActive
                            ? "bg-emerald-100 text-emerald-900 shadow-sm"
                            : "text-slate-900 hover:bg-emerald-50 hover:text-emerald-800",
                        ].join(" ")}
                      >
                        {cat}
                      </button>
                    </li>
                  );
                })}

                {/* دکمه‌ی «بیشتر» فقط اگر آیتم اضافه وجود دارد */}
                {hasOverflow && (
                  <li>
                    <button
                      type="button"
                      onClick={() => openModal(overflowCats, "سایر دسته‌ها")}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/80 bg-emerald-50 text-xl sm:text-2xl text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 hover:text-emerald-900 hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                      aria-label="سایر دسته‌ها"
                    >
                      {/* فلش: از '>' استفاده شده، با CSS برعکس و بزرگ می‌شود */}
                      <span className="menu-more-icon" aria-hidden="true">
                        &gt;
                      </span>
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          )}

          {/* منوی همبرگری روی موبایل */}
          {!isDesktop && (
            <button
              type="button"
              onClick={() => openModal(CATEGORIES, "دسته‌بندی‌ها")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-lg text-emerald-800 shadow-sm transition-all hover:bg-emerald-100"
              aria-label="باز کردن منو"
            >
              ☰
            </button>
          )}
        </div>
      </header>

      {/* مودال دسته‌ها */}
      {isModalOpen && (
        <div
          className="menu-modal-backdrop fixed inset-0 z-50 flex items-start justify-center pt-20"
          onClick={closeModal}
        >
          <div
            className="menu-modal w-full max-w-md rounded-3xl bg-white py-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                {modalTitle}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                بستن
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto px-3 pb-3">
              <ul className="space-y-2">
                {modalCats.map((cat) => {
                  const isActive = active === cat;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => {
                          setActive(cat);
                          closeModal();
                        }}
                        className={[
                          "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm sm:text-base transition-all",
                          isActive
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-slate-50 text-slate-800 hover:bg-emerald-50",
                        ].join(" ")}
                      >
                        <span className="whitespace-nowrap">{cat}</span>
                        {isActive && (
                          <span className="text-xs text-emerald-700">
                            انتخاب شده
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
