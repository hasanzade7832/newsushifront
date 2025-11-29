// src/components/UserMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@/src/libs/api";

const STORAGE_KEY = "sushi_auth";

// به صورت کمکی اگر لازم شد از روی توکن اسم را دربیاریم
function tryGetNameFromToken(parsed: any): string | null {
  try {
    const token: string | undefined = parsed?.token;
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    const payload = JSON.parse(atob(base64));

    const nameFromToken =
      payload.userName ||
      payload.username ||
      payload.name ||
      payload.unique_name ||
      payload.sub ||
      null;

    if (!nameFromToken) return null;
    return String(nameFromToken);
  } catch {
    return null;
  }
}

type AuthInfo = {
  userName: string;
  isAdmin: boolean;
  avatarUrl?: string | null;
};

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<AuthInfo | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawStr = window.localStorage.getItem(STORAGE_KEY);
      if (!rawStr) return;

      const parsed = JSON.parse(rawStr) as Partial<AuthResponse> & {
        [key: string]: any;
      };

      // ۱) مستقیم از فیلدهای آبجکت
      let name: string | null =
        parsed.userName ||
        (parsed as any).username ||
        (parsed as any).UserName ||
        (parsed as any).Name ||
        (parsed.email ? String(parsed.email).split("@")[0] : "") ||
        null;

      // ۲) اگر نبود، از توکن
      if (!name) {
        name = tryGetNameFromToken(parsed);
      }

      if (!name) name = "کاربر";

      setUser({
        userName: name,
        isAdmin: !!parsed.isAdmin,
        avatarUrl: parsed.avatarUrl ?? null,
      });
    } catch {
      setUser({
        userName: "کاربر",
        isAdmin: false,
      });
    }
  }, []);

  const handleToggle = () => setOpen((o) => !o);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setOpen(false);
    router.push("/");
  };

  const handlePanel = () => {
    setOpen(false);
    if (user?.isAdmin) {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  const name = user?.userName ?? "کاربر";

  return (
    <div className="relative">
      {/* پیل پروفایل سفید کنار سرچ */}
      <button
        type="button"
        onClick={handleToggle}
        className="
          flex items-center gap-3
          rounded-full
          bg-white
          text-slate-900
          px-4 py-1.5
          shadow-md shadow-slate-300/70
          border border-slate-200
          hover:shadow-lg
          transition
        "
      >
        <span className="text-sm sm:text-base font-semibold max-w-[140px] truncate">
          {name}
        </span>

        {user?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={name}
            className="
              h-9 w-9 rounded-full object-cover
              ring-2 ring-sky-200
            "
          />
        ) : (
          <span
            className="
              inline-flex items-center justify-center
              h-9 w-9 rounded-full
              bg-gradient-to-br from-sky-400 to-emerald-400
              text-lg
              ring-2 ring-sky-200
            "
          >
            🧑
          </span>
        )}
      </button>

      {/* منو: دو گزینه زیر هم، وسط‌چین */}
      {open && (
        <div
          className="
            absolute left-0 mt-2
            w-52
            rounded-2xl
            bg-white
            border border-slate-200
            shadow-xl
            py-3
            text-sm text-slate-800
            z-50
            flex flex-col items-center gap-2
          "
        >
          <button
            type="button"
            onClick={handlePanel}
            className="
              w-11/12
              px-4 py-2
              text-center
              hover:bg-slate-100
              rounded-xl
            "
          >
            {user?.isAdmin ? "پنل ادمین" : "پنل کاربری"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-11/12
              px-4 py-2
              text-center
              hover:bg-red-50
              rounded-xl
              text-red-600
            "
          >
            خروج از حساب
          </button>
        </div>
      )}
    </div>
  );
}
