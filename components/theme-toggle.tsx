"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Prevent hydration mismatch — don't render the icon until client is mounted
  // (server doesn't know the OS/stored theme yet)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Same size as the real button so layout doesn't shift during hydration
    return <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title="Toggle theme  (D)"       // surfaces the keyboard shortcut from ThemeHotkey
      className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {isDark
        ? <Sun  size={16} className="text-amber-400" />
        : <Moon size={16} className="text-gray-500"  />
      }
    </button>
  );
}