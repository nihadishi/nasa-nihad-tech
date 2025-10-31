"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="logo" width={160} height={32} priority style={{ height: "auto" }} />
          <span className="hidden rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 md:inline">Unofficial · for fun</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link className="hover:opacity-80" href="/apod">APOD</Link>
          <Link className="hover:opacity-80" href="/asteroids">Asteroids</Link>
          <Link className="hover:opacity-80" href="/donki">DONKI</Link>
          <Link className="hover:opacity-80" href="/eonet">EONET</Link>
          <Link className="hover:opacity-80" href="/epic">EPIC</Link>
          <Link className="hover:opacity-80" href="/exoplanets">Exoplanets</Link>
          <Link className="hover:opacity-80" href="/about">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/news" className="hidden rounded-full bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 md:inline">Subscribe</Link>
        </div>
      </div>
    </header>
  );
}


