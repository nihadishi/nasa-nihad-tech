import Image from "next/image";
import Link from "next/link";
import WhatsAboveSection from "@/components/WhatsAboveSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-black dark:bg-[#1a1a1a] dark:text-white">
      <main>
        {/* Hero Section */}
        <section className="border-b-4 border-slate-700 dark:border-slate-600 bg-[#F5F5F0] dark:bg-[#1a1a1a]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
            <div>
              <h1 className="text-6xl font-bold leading-tight tracking-tight md:text-8xl uppercase">
                NASA API<br />Explorer
              </h1>
              <div className="mt-6 inline-flex items-center gap-2 border-4 border-black dark:border-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Free · Research · Educational
              </div>
              <p className="mt-8 max-w-xl text-lg leading-relaxed font-medium">
                A comprehensive platform bringing together NASA&apos;s vast collection of public APIs with interactive 3D visualizations, real-time data, and intuitive exploration tools.
              </p>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link 
                  href="/apod" 
                  className="inline-flex items-center justify-center border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-600 dark:bg-yellow-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[8px_8px_0px_0px_rgba(202,138,4,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  📸 Today&apos;s Photo
                </Link>
                <Link 
                  href="/ssc" 
                  className="inline-flex items-center justify-center border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  🛰️ 3D Satellites
                </Link>
                <Link 
                  href="/trek" 
                  className="inline-flex items-center justify-center border-4 border-purple-600 dark:border-purple-500 bg-purple-600 dark:bg-purple-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[8px_8px_0px_0px_rgba(147,51,234,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  🌙 Planetary Maps
                </Link>
              </div>
              <div className="mt-16 grid grid-cols-3 gap-6">
                <div className="border-l-4 border-blue-600 dark:border-blue-500 pl-4">
                  <div className="text-4xl font-bold">16</div>
                  <div className="text-sm font-bold uppercase tracking-wider mt-1">APIs</div>
                </div>
                <div className="border-l-4 border-green-600 dark:border-green-500 pl-4">
                  <div className="text-4xl font-bold">3D</div>
                  <div className="text-sm font-bold uppercase tracking-wider mt-1">Views</div>
                </div>
                <div className="border-l-4 border-orange-600 dark:border-orange-500 pl-4">
                  <div className="text-4xl font-bold">100%</div>
                  <div className="text-sm font-bold uppercase tracking-wider mt-1">Free</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square w-full border-4 border-black dark:border-white bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 overflow-hidden">
              <Image 
                src="/me.jpg" 
                alt="Developer Profile" 
                fill
                className="object-cover" 
                priority 
              />
            </div>
          </div>
        </section>

        {/* Daily Feature: APOD */}
        <section className="border-b-4 border-slate-700 dark:border-slate-600 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-pink-950/20 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-600 dark:bg-yellow-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider mb-4">
                  🌟 Updated Daily
                </div>
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                  Astronomy Picture of the Day
                </h2>
                <p className="text-lg font-medium leading-relaxed mb-6 max-w-2xl">
                  Every day, NASA features a different stunning image or photograph of our universe, 
                  along with a brief explanation written by a professional astronomer. Discover the cosmos 
                  one photo at a time!
                </p>
                <Link 
                  href="/apod"
                  className="inline-flex items-center justify-center border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  View Today&apos;s Picture →
                </Link>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
                  <div className="text-3xl mb-2">📸</div>
                  <div className="text-2xl font-bold mb-1">365</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Photos/Year</div>
                </div>
                <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
                  <div className="text-3xl mb-2">🌌</div>
                  <div className="text-2xl font-bold mb-1">27+</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Years</div>
                </div>
                <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
                  <div className="text-3xl mb-2">🔭</div>
                  <div className="text-2xl font-bold mb-1">HD</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Quality</div>
                </div>
                <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-2xl font-bold mb-1">Free</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Access</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Above Section */}
        <WhatsAboveSection />

        {/* Interactive 3D Features Highlight */}
        <section className="border-b-4 border-slate-700 dark:border-slate-600 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 pb-6 border-b-4 border-slate-700 dark:border-slate-600">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
                ✨ Featured: Interactive 3D Visualizations
              </h2>
              <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
                Experience space data like never before
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link 
                href="/ssc"
                className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-6xl mb-4">🛰️</div>
                <h3 className="text-2xl font-bold uppercase mb-3">SSC Tracker</h3>
                <p className="text-sm font-medium leading-relaxed mb-4">
                  3D satellite trajectory visualization with interactive controls, time-series charts, and real-time position tracking
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-2 py-1 font-bold uppercase">3D Orbits</span>
                  <span className="border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 px-2 py-1 font-bold uppercase">Charts</span>
                </div>
              </Link>

              <Link 
                href="/tle"
                className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-6xl mb-4">📡</div>
                <h3 className="text-2xl font-bold uppercase mb-3">TLE Database</h3>
                <p className="text-sm font-medium leading-relaxed mb-4">
                  3D orbital models from Two-Line Elements with parameter visualization, apogee/perigee markers, and auto-rotation
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 px-2 py-1 font-bold uppercase">3D Models</span>
                  <span className="border-2 border-yellow-600 dark:border-yellow-400 text-yellow-600 dark:text-yellow-400 px-2 py-1 font-bold uppercase">TLE Data</span>
                </div>
              </Link>

              <Link 
                href="/trek"
                className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold uppercase mb-3">Trek Maps</h3>
                <p className="text-sm font-medium leading-relaxed mb-4">
                  Moon, Mars & Vesta maps with 2D/3D globe views, WMTS tiles, real-time tile tracking, and coordinate display
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-2 py-1 font-bold uppercase">2D Maps</span>
                  <span className="border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 px-2 py-1 font-bold uppercase">3D Globes</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* All 15 APIs */}
        <section className="border-b-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 pb-6 border-b-4 border-slate-700 dark:border-slate-600">
              <h2 className="text-4xl font-bold uppercase tracking-tight mb-3">
                All 16 Integrated APIs
              </h2>
              <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
                Comprehensive space data at your fingertips
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/apod" className="group border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(202,138,4,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">📸</div>
                <h3 className="text-lg font-bold uppercase mb-2">APOD</h3>
                <p className="text-xs">Daily Astronomy Picture</p>
              </Link>

              <Link href="/asteroids" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">☄️</div>
                <h3 className="text-lg font-bold uppercase mb-2">Asteroids</h3>
                <p className="text-xs">Near-Earth Objects tracking</p>
              </Link>

              <Link href="/donki" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">☀️</div>
                <h3 className="text-lg font-bold uppercase mb-2">DONKI</h3>
                <p className="text-xs">Space Weather Database</p>
              </Link>

              <Link href="/eonet" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-lg font-bold uppercase mb-2">EONET</h3>
                <p className="text-xs">Natural Events Tracker</p>
              </Link>

              <Link href="/epic" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🌏</div>
                <h3 className="text-lg font-bold uppercase mb-2">EPIC</h3>
                <p className="text-xs">Earth Imaging Camera</p>
              </Link>

              <Link href="/exoplanets" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🪐</div>
                <h3 className="text-lg font-bold uppercase mb-2">Exoplanets</h3>
                <p className="text-xs">Planetary Systems Archive</p>
              </Link>

              <Link href="/iss" className="group border-4 border-cyan-600 dark:border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(6,182,212,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-lg font-bold uppercase mb-2">ISS</h3>
                <p className="text-xs">Live Space Station</p>
              </Link>

              <Link href="/worldview" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className="text-lg font-bold uppercase mb-2">Worldview</h3>
                <p className="text-xs">Satellite Imagery Viewer</p>
              </Link>

              <Link href="/mars-weather" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🔴</div>
                <h3 className="text-lg font-bold uppercase mb-2">Mars</h3>
                <p className="text-xs">Weather & Rover Data</p>
              </Link>

              {/* <Link href="/mars-rover" className="group border-4 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/20 p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">📸</div>
                <h3 className="text-lg font-bold uppercase mb-2">Mars Rover</h3>
                <p className="text-xs">Photo Gallery</p>
              </Link> */}

              <Link href="/n2yo" className="group border-4 border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-950/20 p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(22,163,74,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🛰️</div>
                <h3 className="text-lg font-bold uppercase mb-2">N2YO</h3>
                <p className="text-xs">Satellite Tracking</p>
              </Link>

              <Link href="/nasa-images" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-bold uppercase mb-2">Media</h3>
                <p className="text-xs">Image & Video Library</p>
              </Link>

              <Link href="/osdr" className="group border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🧬</div>
                <h3 className="text-lg font-bold uppercase mb-2">OSDR</h3>
                <p className="text-xs">Space Biology Research</p>
              </Link>

              <Link href="/ssc" className="group border-4 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🛰️</div>
                <h3 className="text-lg font-bold uppercase mb-2">SSC</h3>
                <p className="text-xs">Satellite 3D Tracker</p>
              </Link>

              <Link href="/tle" className="group border-4 border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/20 p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(147,51,234,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">📡</div>
                <h3 className="text-lg font-bold uppercase mb-2">TLE</h3>
                <p className="text-xs">Orbital Elements 3D</p>
              </Link>

              <Link href="/trek" className="group border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6 transition-all hover:shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] hover:-translate-y-1 hover:-translate-x-1">
                <div className="text-4xl mb-3">🌙</div>
                <h3 className="text-lg font-bold uppercase mb-2">Trek</h3>
                <p className="text-xs">Planetary Maps 2D/3D</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="bg-blue-50 dark:bg-blue-950/20 py-16 border-b-4 border-blue-600 dark:border-blue-500">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">
              Non-Commercial Use Only
            </h2>
            <p className="text-lg font-medium leading-relaxed mb-6">
              This website is <strong className="font-bold">FREE</strong> and provided for <strong className="font-bold">research, educational, and personal exploration only</strong>. Not for commercial use.
            </p>
            <Link 
              href="/about"
              className="inline-flex items-center justify-center border-4 border-blue-600 dark:border-blue-500 bg-white dark:bg-black text-black dark:text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
            >
              Learn More About This Project
            </Link>
          </div>
        </section>

        {/* Built By */}
        <section className="bg-purple-50 dark:bg-purple-950/20 py-16 border-b-4 border-purple-600 dark:border-purple-500">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="text-5xl mb-6">🔧</div>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">
              Built by an Embedded Engineer
            </h2>
            <p className="text-lg font-medium leading-relaxed mb-6">
              Created by a <strong className="font-bold">C/C++ embedded systems engineer</strong> (Raspberry Pi, NVIDIA Jetson, STM32) expanding into web development to showcase space data visualization.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://github.com/nihadishi"
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
              >
                🐙 GitHub: @nihadishi
              </a>
              <a 
                href="https://linkedin.com/in/nihadishi"
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
              >
                💼 LinkedIn: /in/nihadishi
              </a>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-zinc-100 dark:bg-zinc-900 py-24 border-b-4 border-slate-700 dark:border-slate-600">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-6">
              Technology Stack
            </h2>
            <p className="text-lg font-medium leading-relaxed mb-12">
              Built with modern web technologies: Next.js, React, Three.js, Leaflet, Recharts
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                Next.js 16
              </div>
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                React 19
              </div>
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                Three.js
              </div>
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                Leaflet Maps
              </div>
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider">
                Real-Time APIs
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
