// app/admin/page.tsx
export default function AdminHomePage() {
  return (
    <section className="h-full flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col items-center gap-6">
        <h2 className="text-2xl font-extrabold text-center">
          خوش آمدی به پنل مدیریت 🍣
        </h2>
        <p className="text-sm text-slate-400 text-center max-w-lg">
          از اینجا می‌تونی محصولات و کاربران را مدیریت کنی. برای شروع، چند محصول
          جدید اضافه کن یا سطح دسترسی کاربران را تنظیم کن.
        </p>
      </div>
    </section>
  );
}
