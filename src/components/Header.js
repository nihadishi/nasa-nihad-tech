"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "Me" },
    { href: "/apod", label: "APOD" },
    { href: "/asteroids", label: "Asteroids" },
    { href: "/donki", label: "DONKI" },
    { href: "/eonet", label: "EONET" },
    { href: "/epic", label: "EPIC" },
    { href: "/exoplanets", label: "Exoplanets" },
    { href: "/iss", label: "ISS" },
    { href: "/worldview", label: "Worldview" },
    { href: "/mars-weather", label: "Mars Weather" },
    // { href: "/mars-rover", label: "Mars Rover" },
    { href: "/nasa-images", label: "Media" },
    { href: "/osdr", label: "OSDR" },
    { href: "/ssc", label: "SSC" },
    { href: "/tle", label: "TLE" },
    { href: "/trek", label: "Trek" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b-4 border-slate-700 dark:border-slate-600 bg-[#F5F5F0] dark:bg-[#1a1a1a]">
      <div className="mx-auto max-w-[1800px] px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.svg" alt="logo" width={120} height={24} priority style={{ height: "auto" }} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-4xl mx-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border-2 border-transparent hover:border-black dark:hover:border-white no-underline whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              disabled
              title="Language selector - Coming soon (In Development)"
              aria-label="Language selector - Coming soon"
              className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-900 outline-none transition opacity-50 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <span className="sr-only">Language</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-red-500 text-white px-1 rounded">DEV</span>
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              aria-label="Menu"
            >
              <span className={`w-5 h-0.5 bg-black dark:bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-black dark:bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-black dark:bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden border-t-2 border-black dark:border-white py-4">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wider text-center text-black dark:text-white bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all no-underline whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}


