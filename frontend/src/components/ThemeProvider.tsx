"use client";

import { useEffect } from "react";
import { useOSStore } from "@/store/useOSStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useOSStore();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
}
