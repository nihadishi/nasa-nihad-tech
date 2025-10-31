"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/apod", label: "APOD" },
    { href: "/asteroids", label: "Asteroids" },
    { href: "/donki", label: "DONKI" },
    { href: "/eonet", label: "EONET" },
    { href: "/epic", label: "EPIC" },
    { href: "/exoplanets", label: "Exoplanets" },
    { href: "/worldview", label: "Worldview" },
    { href: "/mars-weather", label: "Mars" },
    { href: "/nasa-images", label: "Media" },
    { href: "/osdr", label: "OSDR" },
    { href: "/about", label: "About" }
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
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border-2 border-transparent hover:border-black dark:hover:border-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
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
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wider text-center text-black dark:text-white bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
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


