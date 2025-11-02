"use client";

import { useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme");
    const rootHasDark = document.documentElement.classList.contains("dark");
    return stored || (rootHasDark ? "dark" : "light");
  });

  function applyTheme(next) {
    const root = document.documentElement;
    if (next === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#ededed");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#171717");
    }
  }

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      suppressHydrationWarning
      disabled
      onClick={(e) => e.preventDefault()}
      aria-label="Theme toggle - Coming soon (In Development)"
      aria-pressed={theme === "dark"}
      title="Theme toggle - Coming soon (In Development)"
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-900 outline-none transition opacity-50 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <span className="sr-only">Theme</span>
      <svg suppressHydrationWarning
        className={`h-5 w-5 transform transition-all duration-300 ${theme === "dark" ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg suppressHydrationWarning
        className={`absolute h-5 w-5 transform transition-all duration-300 ${theme === "dark" ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-red-500 text-white px-1 rounded">DEV</span>
    </button>
  );
}


