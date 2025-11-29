// app/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  login,
  register,
  LoginRequest,
  RegisterRequest,
} from "@/src/libs/api";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // برای انیمیشن ورود
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 700);
    return () => clearTimeout(t);
  }, []);

  // login
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // register
  const [regUserName, setRegUserName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: LoginRequest = {
        userNameOrEmail: loginIdentifier,
        password: loginPassword,
      };
      const auth = await login(payload);

      if (auth.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/products"); // یوزر عادی → لیست محصولات
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "ورود ناموفق بود. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: RegisterRequest = {
        userName: regUserName,
        email: regEmail,
        password: regPassword,
      };
      const auth = await register(payload);

      if (auth.isAdmin) {
        router.push("/admin");
      } else {
        setMode("login");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "ثبت‌نام ناموفق بود. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen h-screen overflow-hidden bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      {/* نوار لودینگ سفید بالای صفحه */}
      {showSplash && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
          <div className="h-1 bg-white/80 animate-pulse" />
        </div>
      )}

      {/* کارت وسط با انیمیشن نرم از بالا */}
      <div
        className={`w-full max-w-4xl flex flex-row-reverse bg-slate-900/80 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 transition-all duration-700
        ${
          showSplash
            ? "opacity-0 -translate-y-6"
            : "opacity-100 translate-y-0"
        }`}
      >
        {/* سمت راست - باکگراند خوشگل */}
        <section className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-b from-emerald-500 to-sky-500 text-slate-900 p-10">
          <h1 className="text-3xl font-extrabold mb-4 text-center">
            Sushi Admin Panel
          </h1>
          <p className="text-center text-sm font-medium leading-relaxed">
            وارد حساب خودت شو، محصولات را مدیریت کن و سفارش‌های خوشمزه‌ات را
            کنترل کن 🍣
          </p>
        </section>

        {/* سمت چپ - فرم‌ها */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="mb-6 flex w-full max-w-sm rounded-full bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-full transition
              ${
                mode === "login"
                  ? "bg-sky-500 text-slate-900"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-full transition
              ${
                mode === "register"
                  ? "bg-emerald-400 text-slate-900"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          {error && (
            <div className="mb-4 w-full max-w-sm rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form
              onSubmit={handleLogin}
              className="w-full max-w-sm space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  نام کاربری یا ایمیل
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  رمز عبور
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-2.5 text-sm transition disabled:opacity-60"
              >
                {loading ? "در حال ورود..." : "ورود"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              className="w-full max-w-sm space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  نام کاربری
                </label>
                <input
                  type="text"
                  required
                  value={regUserName}
                  onChange={(e) => setRegUserName(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  ایمیل
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  رمز عبور
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold py-2.5 text-sm transition disabled:opacity-60"
              >
                {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
