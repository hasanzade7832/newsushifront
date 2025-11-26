// src/components/AppThemeProvider.tsx
"use client";

import * as React from "react";

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // فعلاً هیچ تمی اعمال نمی‌کنیم
  return <>{children}</>;
}
