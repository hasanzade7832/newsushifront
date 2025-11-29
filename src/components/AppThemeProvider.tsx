// src/components/AppThemeProvider.tsx
"use client";

import * as React from "react";

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // فعلاً تم خاصی نداریم، فقط رَپر
  return <>{children}</>;
}
