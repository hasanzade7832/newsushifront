// app/page.tsx
import type { Metadata } from "next";

// همون صفحه‌ی محصولات رو به عنوان صفحه‌ی اصلی استفاده می‌کنیم
export { default } from "./products/page";

export const metadata: Metadata = {
  title: "محصولات | Sushi",
};
