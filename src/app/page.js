import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-black dark:bg-[#1a1a1a] dark:text-white">
      <main>
        <section className="border-b-4 border-slate-700 dark:border-slate-600 bg-[#F5F5F0] dark:bg-[#1a1a1a]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
            <div>
              <h1 className="text-6xl font-bold leading-tight tracking-tight md:text-8xl uppercase">
                NASA<br />Data Portal
              </h1>
              <div className="mt-6 inline-flex items-center gap-2 border-4 border-black dark:border-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Elegant · Unofficial · For Fun
              </div>
              <p className="mt-8 max-w-xl text-lg leading-relaxed font-medium">
                Exploring the cosmos with data, imagery, and real-time information from NASA&apos;s public APIs
              </p>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link 
                  href="/nasa-images" 
                  className="inline-flex items-center justify-center border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  Explore Media
                </Link>
                <Link 
                  href="/apod" 
                  className="inline-flex items-center justify-center border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  Daily Picture
                </Link>
              </div>
              <div className="mt-16 grid grid-cols-3 gap-6">
                <div className="border-l-4 border-blue-600 dark:border-blue-500 pl-4">
                  <div className="text-4xl font-bold">140+</div>
                  <div className="text-sm font-bold uppercase tracking-wider mt-1">Missions</div>
                </div>
                <div className="border-l-4 border-green-600 dark:border-green-500 pl-4">
                  <div className="text-4xl font-bold">65</div>
                  <div className="text-sm font-bold uppercase tracking-wider mt-1">Years</div>
                </div>
                <div className="border-l-4 border-orange-600 dark:border-orange-500 pl-4">
                  <div className="text-4xl font-bold">24/7</div>
                  <div className="text-sm font-bold uppercase tracking-wider mt-1">Live</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square w-full border-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-900">
              <div className="absolute inset-0 grid place-items-center p-10">
                <Image 
                  src="/logo.svg" 
                  alt="NASA Logo" 
                  width={400} 
                  height={400} 
                  className="opacity-60" 
                  priority 
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-4 border-black dark:border-white bg-white dark:bg-black py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 pb-6 border-b-4 border-black dark:border-white">
              <h2 className="text-4xl font-bold uppercase tracking-tight">
                Featured APIs
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Link 
                href="/apod"
                className="group border-4 border-black dark:border-white bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-5xl mb-4">🌌</div>
                <h3 className="text-2xl font-bold uppercase mb-3">APOD</h3>
                <p className="text-sm font-medium leading-relaxed">
                  Astronomy Picture of the Day with daily cosmic imagery
                </p>
              </Link>

              <Link 
                href="/mars-weather"
                className="group border-4 border-black dark:border-white bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-5xl mb-4">🔴</div>
                <h3 className="text-2xl font-bold uppercase mb-3">Mars Weather</h3>
                <p className="text-sm font-medium leading-relaxed">
                  Real-time weather data from Mars InSight lander
                </p>
              </Link>

              <Link 
                href="/worldview"
                className="group border-4 border-black dark:border-white bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold uppercase mb-3">Worldview</h3>
                <p className="text-sm font-medium leading-relaxed">
                  Interactive Earth satellite imagery visualization
                </p>
              </Link>

              <Link 
                href="/asteroids"
                className="group border-4 border-black dark:border-white bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-5xl mb-4">☄️</div>
                <h3 className="text-2xl font-bold uppercase mb-3">Asteroids</h3>
                <p className="text-sm font-medium leading-relaxed">
                  Near-Earth Objects and asteroid tracking data
                </p>
              </Link>

              <Link 
                href="/exoplanets"
                className="group border-4 border-black dark:border-white bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-5xl mb-4">🪐</div>
                <h3 className="text-2xl font-bold uppercase mb-3">Exoplanets</h3>
                <p className="text-sm font-medium leading-relaxed">
                  Explore thousands of discovered exoplanets
                </p>
              </Link>

              <Link 
                href="/nasa-images"
                className="group border-4 border-black dark:border-white bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-5xl mb-4">📷</div>
                <h3 className="text-2xl font-bold uppercase mb-3">Media Library</h3>
                <p className="text-sm font-medium leading-relaxed">
                  Search NASA&apos;s vast image and video archive
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-zinc-100 dark:bg-zinc-900 py-24 border-b-4 border-black dark:border-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-6">
              Data from NASA
            </h2>
            <p className="text-lg font-medium leading-relaxed mb-12">
              All data is fetched from official NASA public APIs in real-time. This is an unofficial fan project showcasing the power of open data.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                Real-Time Data
              </div>
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                Public APIs
              </div>
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                Open Source
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
