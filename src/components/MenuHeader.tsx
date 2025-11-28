// src/components/MenuHeaderText.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Category = {
  id: string;
  label: string;
  count: number;
};

const CATEGORIES: Category[] = [
  { id: "all", label: "ALL", count: 32 },
  { id: "meaty", label: "MEATY", count: 7 },
  { id: "vegetarian", label: "VEGETARIAN", count: 5 },
  { id: "vegan", label: "VEGAN", count: 4 },
  { id: "seafood", label: "SEAFOOD", count: 6 },
  { id: "dessert", label: "DESSERT", count: 3 },
  { id: "sides", label: "SIDES", count: 8 },
  { id: "popular", label: "MOST POPULAR", count: 10 },
];

export default function MenuHeaderText() {
  const [activeId, setActiveId] = useState<string>("all");
  const [hasOverflow, setHasOverflow] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // تشخیص وجود اسکرول افقی
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const scrollWidth = el.scrollWidth;
      const clientWidth = el.clientWidth;
      setHasOverflow(scrollWidth > clientWidth + 1);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const SCROLL_STEP = 280;

  const handleArrow = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    // LTR: راست → جلو، چپ → عقب
    const delta = dir === "right" ? SCROLL_STEP : -SCROLL_STEP;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleClick = (id: string) => {
    setActiveId(id);
    setHasClicked(true);
  };

  return (
    <div className="w-full pt-2 pb-3">
      <div className="relative px-4 sm:px-6 md:px-8 max-w-[110rem] mx-auto">
        {/* فلش سمت چپ (آیکون مشکی) */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => handleArrow("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20
                       h-10 w-10 rounded-full bg-white border border-slate-200 shadow
                       flex items-center justify-center hover:bg-slate-100
                       text-slate-900"
            aria-label="Scroll left"
          >
            ❯
          </button>
        )}

        {/* فلش سمت راست */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => handleArrow("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20
                       h-10 w-10 rounded-full bg-white border border-slate-200 shadow
                       flex items-center justify-center hover:bg-slate-100
                       text-slate-900"
            aria-label="Scroll right"
          >
            ❮
          </button>
        )}

        {/* ردیف دسته‌ها */}
        <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
          <ul
            className="
              flex flex-row flex-nowrap
              gap-4 sm:gap-5 md:gap-6
              px-3
              justify-start
              lg:justify-center
              items-center
              h-16
            "
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeId === cat.id;
              const isInitialAll =
                cat.id === "all" && !hasClicked && activeId === "all";

              // دایره برای ALL از اول هست، برای بقیه بعد از کلیک
              const showCircle = isActive && (hasClicked || cat.id === "all");

              const circleClassName = [
                "inline-flex items-center justify-center",
                "h-8 rounded-full bg-yellow-400 text-emerald-900",
                "text-sm font-extrabold overflow-hidden origin-center",
                showCircle
                  ? "w-8 opacity-100 scale-100"
                  : "w-0 opacity-0 scale-50",
                isInitialAll ? "" : "transition-all duration-200.ease-out",
              ].join(" ");

              return (
                <li key={cat.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleClick(cat.id)}
                    className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    {/* متن + دایره زرد */}
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "uppercase tracking-[0.18em]",
                          "text-base sm:text-lg md:text-xl font-extrabold",
                          "whitespace-nowrap",
                          isActive ? "text-sky-500" : "text-emerald-800",
                        ].join(" ")}
                      >
                        {cat.label}
                      </span>

                      <span className={circleClassName}>{cat.count}</span>
                    </div>

                    {/* نقطه‌های زیر آیتم فعال */}
                    <div className="mt-1 h-3 flex items-center justify-center">
                      {isActive && (
                        <div className="flex gap-1">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-sky-400"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
