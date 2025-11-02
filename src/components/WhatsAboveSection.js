import Link from 'next/link';

export default function WhatsAboveSection() {
  return (
    <section className="border-b-4 border-slate-700 dark:border-slate-600 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border-4 border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider mb-6">
            🌟 Featured Interactive
          </div>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            What&apos;s Above You Right Now?
          </h2>
          <p className="text-lg font-medium leading-relaxed mb-8 max-w-3xl mx-auto">
            Discover satellites passing overhead in real-time! Enter your location to see which satellites are currently visible above you. Track ISS, Starlink, GPS satellites, and thousands more with interactive 3D visualization.
          </p>
          <Link 
            href="/n2yo"
            className="inline-flex items-center justify-center border-4 border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
          >
            🔭 Explore What&apos;s Above →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
            <div className="text-5xl mb-4">🛰️</div>
            <h3 className="text-lg font-bold uppercase mb-2 text-black dark:text-white">Real-Time Tracking</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              See satellites passing overhead in real-time with live position updates
            </p>
          </div>

          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-lg font-bold uppercase mb-2 text-black dark:text-white">3D Visualization</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Interactive 3D globe showing satellite positions and orbits around Earth
            </p>
          </div>

          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
            <div className="text-5xl mb-4">📡</div>
            <h3 className="text-lg font-bold uppercase mb-2 text-black dark:text-white">Multiple Endpoints</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              TLE data, position tracking, visual passes, radio passes, and more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

