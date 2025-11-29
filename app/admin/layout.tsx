// app/admin/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setAuthToken } from "@/src/libs/api";

const navItems = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/products/new", label: "افزودن محصول" },
  { href: "/admin/users", label: "مدیریت کاربران" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("sushi_auth");
    }
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* flex-row-reverse => سایدبار حتماً می‌رود سمت راست */}
      <div className="flex flex-row-reverse h-full">
        {/* سایدبار سمت راست */}
        <aside className="w-72 bg-slate-900/95 border-l border-slate-800 flex flex-col items-center py-8 gap-6">
          {/* عنوان بالای سایدبار */}
          <div className="text-center px-4">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1">
              پنل ادمین سوشی
            </h1>
            <p className="text-sm text-slate-400">
              مدیریت محصولات و کاربران
            </p>
          </div>

          {/* 👇 دکمه نمایش سایت بالای گزینه‌ها - در تب جدید باز شود */}
          <div className="w-full px-6">
            <Link
              href="/products"
              target="_blank"
              rel="noopener noreferrer"
              className="
                block w-full
                rounded-2xl
                text-center
                py-3
                text-base
                font-bold
                bg-white
                text-slate-900
                border border-slate-200
                shadow-md shadow-slate-300/70
                hover:bg-slate-100
                hover:-translate-y-0.5
                hover:shadow-lg
                transition
              "
            >
              نمایش سایت
            </Link>
          </div>

          {/* منو اصلی */}
          <nav className="flex flex-col gap-3 w-full px-6">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full rounded-2xl text-center py-3 text-base font-bold transition
                  ${
                    active
                      ? "bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-400/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* خروج از حساب در پایین سایدبار */}
          <div className="mt-auto w-full px-6">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl bg-red-500 hover:bg-red-400 text-slate-50 font-bold text-base py-3 transition"
            >
              خروج از حساب
            </button>
          </div>
        </aside>

        {/* محتوای اصلی سمت چپ */}
        <main className="flex-1 h-full flex items-center justify-center px-6">
          <div className="w-full max-w-4xl h-full flex items-center justify-center">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
