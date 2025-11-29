"use client";

import { FormEvent, useEffect, useState } from "react";
import { Profile, getProfile, updateProfile } from "@/src/libs/api";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const AVATAR_BASE = API_BASE.replace(/\/api\/?$/, "") + "/uploads/avatars";

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const p = await getProfile();
        setProfile(p);
        setUserName(p.userName);
        setEmail(p.email);
      } catch (err: any) {
        console.error(err);
        if (err?.response?.status === 401) {
          router.push("/auth");
        } else {
          setError("گرفتن اطلاعات پروفایل با خطا مواجه شد.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const form = new FormData();
      form.append("UserName", userName);
      form.append("Email", email);
      if (newPassword) form.append("NewPassword", newPassword);
      if (avatarFile) form.append("avatar", avatarFile);

      await updateProfile(form);

      // بعد از موفقیت، برگرد به صفحه اصلی
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "ذخیره اطلاعات پروفایل با خطا مواجه شد."
      );
    }
  };

  const currentAvatarUrl =
    avatarPreview ??
    (profile?.avatarFileName
      ? `${AVATAR_BASE}/${profile.avatarFileName}`
      : null);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-emerald-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-xl bg-slate-900/85 border border-slate-800 rounded-3xl p-6 space-y-5">
        <h1 className="text-2xl font-extrabold mb-2">
          پنل کاربری
        </h1>

        {error && (
          <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-20 h-20 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-slate-400">
                  {userName.slice(0, 2)}
                </span>
              )}
            </div>

            <label className="flex-1 cursor-pointer border-2 border-dashed border-slate-600 hover:border-emerald-400 bg-slate-950/60 rounded-2xl px-4 py-3 flex flex-col items-center justify-center text-xs text-slate-300">
              <span className="font-bold mb-1">
                تغییر تصویر پروفایل
              </span>
              <span className="text-[11px] text-slate-500">
                روی اینجا کلیک کنید و تصویر جدید را انتخاب کنید
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleAvatarChange(
                    e.target.files && e.target.files[0]
                      ? e.target.files[0]
                      : null
                  )
                }
              />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                نام کاربری
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                ایمیل
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                رمز عبور جدید (اختیاری)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                اگر خالی بگذارید، رمز عبور تغییر نمی‌کند.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-sm font-extrabold text-slate-900 transition"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
