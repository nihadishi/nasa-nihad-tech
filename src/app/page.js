import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-black dark:text-zinc-100">
      <main>
        <section className="relative border-b border-zinc-200/70 bg-white dark:border-zinc-800 dark:bg-black">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
            <div>
              <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">nasa.nihad.tech</h1>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-[11px] uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">Elegant · Unofficial · For Fun</p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">Exploring the cosmos with a refined, minimalist aesthetic—missions, imagery, and stories that inspire.</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/missions" className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">Explore Missions</Link>
                <Link href="/images" className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900">Latest Images</Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6 text-center text-sm">
                <div>
                  <div className="text-2xl font-semibold">140+</div>
                  <div className="text-zinc-600 dark:text-zinc-400">Active Missions</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">65 yrs</div>
                  <div className="text-zinc-600 dark:text-zinc-400">of Exploration</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">24/7</div>
                  <div className="text-zinc-600 dark:text-zinc-400">Deep Space Comms</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square w-full rounded-3xl border border-zinc-200 bg-zinc-50 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-900">
              <div className="absolute inset-0 grid place-items-center p-10">
                <Image src="/globe.svg" alt="Globe" width={360} height={360} className="opacity-80" priority />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200/70 bg-white py-24 dark:border-zinc-800 dark:bg-black">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Featured Missions</h2>
              <Link href="/missions" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">View all</Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <article className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-950">
                <Image src="/window.svg" alt="Artemis" width={40} height={40} />
                <h3 className="mt-4 text-lg font-semibold">Artemis</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Returning humans to the Moon and preparing for Mars.</p>
                <a href="/missions" className="mt-4 inline-block text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-700">Learn more</a>
              </article>
              <article className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-950">
                <Image src="/file.svg" alt="James Webb" width={40} height={40} />
                <h3 className="mt-4 text-lg font-semibold">James Webb Space Telescope</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Peering back in time to the first galaxies.</p>
                <a href="/missions" className="mt-4 inline-block text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-700">Learn more</a>
              </article>
              <article className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-950">
                <Image src="/vercel.svg" alt="Mars Rovers" width={40} height={40} className="dark:invert" />
                <h3 className="mt-4 text-lg font-semibold">Mars Rovers</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Perseverance and Curiosity exploring the Red Planet.</p>
                <a href="/missions" className="mt-4 inline-block text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-700">Learn more</a>
              </article>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200/70 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-10 text-2xl font-semibold tracking-tight md:text-3xl">Latest Images</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="grid h-full place-items-center p-6">
                  <Image src="/globe.svg" alt="Earth" width={220} height={220} className="opacity-80" />
                </div>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="grid h-full place-items-center p-6">
                  <Image src="/next.svg" alt="Nebula" width={220} height={220} className="opacity-80 dark:invert" />
                </div>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="grid h-full place-items-center p-6">
                  <Image src="/window.svg" alt="Lunar surface" width={220} height={220} className="opacity-80" />
                </div>
              </div>
            </div>
            <div className="mt-8 text-right">
              <Link href="/images" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Browse gallery →</Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 dark:bg-black">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Stay updated</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">Get mission updates, imagery releases, and news delivered to your inbox.</p>
            <form className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:flex-row">
              <input type="email" required placeholder="Your email" className="w-full rounded-full border border-zinc-300 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-200" />
              <button type="submit" className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:w-auto">Subscribe</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
