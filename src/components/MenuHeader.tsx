// src/components/MenuHeader.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Story = {
  id: string;
  label: string;
  image: string;
};

const STORIES: Story[] = [
  {
    id: "all",
    label: "همه",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "classic",
    label: "سوشی کلاسیک",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "special",
    label: "سوشی ویژه",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "meat",
    label: "سوشی مرغ و گوشت",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "veggie",
    label: "سوشی سبزیجات",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rolls",
    label: "رول‌های خاص",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "combo",
    label: "ست‌های ترکیبی",
    image:
      "https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "fried",
    label: "سوشی سوخاری",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "spicy",
    label: "سوشی تند",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "maki",
    label: "رول ماکی",
    image:
      "https://images.unsplash.com/photo-1485249245068-d8dc50b77cc7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "nigiri",
    label: "نیگیری",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "mix",
    label: "سوشی میکس",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80",
  },
];

export default function MenuHeader() {
  const [activeId, setActiveId] = useState<string>("all");
  const [hasOverflow, setHasOverflow] = useState(false);

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

    // RTL:
    // فلش کنار «همه» (راست) → آیتم‌ها را به سمت چپ می‌برد (آیتم‌های بعدی)
    // فلش سمت چپ → برمی‌گرداند به سمت «همه»
    const delta = dir === "right" ? SCROLL_STEP : -SCROLL_STEP;

    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="w-full pt-2 pb-3">
      {/* اسلایدر وسط‌چین با عرض زیاد */}
      <div className="relative px-4 sm:px-6 md:px-8 max-w-[110rem] mx-auto">
        {/* فلش کنار «همه» */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => handleArrow("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20
                       h-10 w-10 rounded-full bg-white border border-slate-200 shadow
                       flex items-center justify-center hover:bg-slate-100"
            aria-label="اسکرول به راست"
          >
            ❮
          </button>
        )}

        {/* لیست استوری‌ها */}
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar"
          dir="rtl"
        >
          <ul
            className="
              flex flex-row flex-nowrap
              gap-4 sm:gap-5 md:gap-6
              px-3
              justify-start
              lg:justify-center
            "
          >
            {STORIES.map((story) => {
              const isActive = activeId === story.id;

              return (
                <li key={story.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setActiveId(story.id)}
                    className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={[
                        "w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr",
                        "transition-all duration-200",
                        "group-hover:-translate-y-1 group-hover:scale-105",
                        isActive
                          ? "from-pink-500 via-purple-500 to-yellow-400"
                          : "from-slate-300 via-slate-200 to-slate-300",
                      ].join(" ")}
                    >
                      <div className="w-full h-full rounded-full bg-white p-[3px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={story.image}
                          alt={story.label}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>

                    <span
                      className={[
                        "mt-1 text-xs sm:text-sm md:text-base font-medium text-center",
                        "max-w-[6.5rem] sm:max-w-[7.5rem] overflow-hidden text-ellipsis whitespace-nowrap",
                        isActive ? "text-slate-900" : "text-slate-600",
                      ].join(" ")}
                    >
                      {story.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* فلش سمت چپ */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => handleArrow("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20
                       h-10 w-10 rounded-full bg-white border border-slate-200 shadow
                       flex items-center justify-center hover:bg-slate-100"
            aria-label="اسکرول به چپ"
          >
            ❯
          </button>
        )}
      </div>
    </div>
  );
}
