"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/src/theme/muiTheme";

/**
 * این کامپوننت، تم MUI و CssBaseline رو روی کل اپ اعمال می‌کند.
 */
export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      {/* ریست استایل‌های پیش‌فرض مرورگر بر اساس متریال */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
