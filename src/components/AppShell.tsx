// src/components/AppShell.tsx
"use client";

import { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {children}
    </div>
  );
}
