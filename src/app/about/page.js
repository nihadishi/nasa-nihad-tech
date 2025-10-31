export const metadata = {
  title: "NASA API Explorer — About",
  description: "About the NASA API Explorer - A comprehensive platform for exploring NASA's open data and APIs.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 border-b-4 border-slate-700 dark:border-slate-600 pb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Information</p>
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">About This Project</h1>
          <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
            NASA API Explorer Platform
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Project Overview */}
          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
              Project Overview
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                <strong className="font-bold">NASA API Explorer</strong> is a comprehensive web platform that brings together 
                NASA&apos;s vast collection of public APIs and data services into one unified, easy-to-use interface. 
                This project demonstrates the power and accessibility of NASA&apos;s open data initiative.
              </p>
              <p>
                Built with modern web technologies including Next.js, React, Three.js, and Leaflet, this platform 
                provides interactive visualizations, real-time data displays, and intuitive exploration tools for 
                space enthusiasts, researchers, educators, and developers.
              </p>
            </div>
          </div>

          {/* Developer Background */}
          <div className="border-4 border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/20 p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-purple-600 dark:border-purple-500 pb-2">
              🔧 About the Developer
            </h2>
            <div className="space-y-4 leading-relaxed">
              <div className="border-2 border-purple-600 dark:border-purple-500 bg-white dark:bg-black p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Background</h3>
                <p className="text-sm">
                  This project was built by an <strong className="font-bold">Embedded Software Engineer</strong> specializing 
                  in low-level programming and hardware integration. Primary expertise includes:
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>C/C++</strong> programming for embedded systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>Raspberry Pi</strong> development and IoT applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>NVIDIA Jetson</strong> series for AI/ML at the edge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>STM32</strong> microcontroller programming</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>Low-level systems</strong> and hardware-software integration</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-purple-600 dark:border-purple-500 bg-white dark:bg-black p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Cross-Domain Skills</h3>
                <p className="text-sm leading-relaxed">
                  While <strong className="font-bold">not a frontend or backend developer by profession</strong>, this project 
                  demonstrates the ability to adapt and learn new technologies. The transition from low-level embedded systems 
                  to high-level web development showcases versatility and a strong foundation in computer science fundamentals.
                </p>
              </div>

              <div className="border-2 border-purple-600 dark:border-purple-500 bg-white dark:bg-black p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Why This Project?</h3>
                <p className="text-sm leading-relaxed">
                  Combining embedded systems expertise with space data visualization creates a unique perspective on 
                  data presentation and real-time processing - skills directly applicable to satellite telemetry, 
                  IoT sensor networks, and edge computing applications in aerospace engineering.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
              Integrated APIs & Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">📸 APOD</h3>
                <p className="text-sm">Astronomy Picture of the Day with archive browsing and detailed astronomical information.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">☄️ Asteroids</h3>
                <p className="text-sm">Near-Earth Objects tracking with interactive charts and hazard assessment.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">☀️ DONKI</h3>
                <p className="text-sm">Space Weather Database for solar flares, CMEs, and geomagnetic storms.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🌍 EONET</h3>
                <p className="text-sm">Earth Observatory Natural Events Tracker with interactive mapping.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🌏 EPIC</h3>
                <p className="text-sm">Earth Polychromatic Imaging Camera - Full-disc Earth imagery from space.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🪐 Exoplanets</h3>
                <p className="text-sm">NASA Exoplanet Archive with detailed planetary system information.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🗺️ Worldview</h3>
                <p className="text-sm">Interactive satellite imagery viewer with multiple data layers.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🔴 Mars Weather</h3>
                <p className="text-sm">Real-time weather data from Mars rovers and landers.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">📚 Media Library</h3>
                <p className="text-sm">NASA&apos;s vast collection of images, videos, and audio files.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🧬 OSDR</h3>
                <p className="text-sm">Open Science Data Repository for space biology research.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🛰️ SSC</h3>
                <p className="text-sm">Satellite Situation Center with 3D trajectory visualization and time-series charts.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">📡 TLE</h3>
                <p className="text-sm">Two-Line Element sets with 3D orbital models and parameter visualization.</p>
              </div>
              
              <div className="border-2 border-slate-700 dark:border-slate-600 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">🌙 Trek</h3>
                <p className="text-sm">Moon, Mars, and Vesta WMTS map tiles with 2D/3D viewing options.</p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
              Technology Stack
            </h2>
            <p className="text-sm text-black/70 dark:text-white/70 mb-6 italic">
              Note: Built by an embedded systems engineer learning web development - this represents a cross-domain skill expansion!
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Web Framework</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">▸</span>
                    <span><strong>Next.js 16</strong> - React framework</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">▸</span>
                    <span><strong>React 19</strong> - UI library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">▸</span>
                    <span><strong>Tailwind CSS 4</strong> - Styling</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">3D Graphics</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>Three.js</strong> - 3D rendering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>React Three Fiber</strong> - 3D in React</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">▸</span>
                    <span><strong>@react-three/drei</strong> - 3D helpers</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Data Visualization</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">▸</span>
                    <span><strong>Leaflet</strong> - Interactive maps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">▸</span>
                    <span><strong>Recharts</strong> - Time-series charts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">▸</span>
                    <span><strong>React Leaflet</strong> - Map components</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="border-4 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-blue-600 dark:border-blue-500 pb-2">
              ⚠️ Important Notice
            </h2>
            <div className="space-y-4">
              <div className="border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-black p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Non-Commercial Use</h3>
                <p className="text-sm leading-relaxed">
                  This website is <strong className="font-bold">NOT FOR COMMERCIAL USE</strong>. It is provided 
                  free of charge for <strong className="font-bold">research, educational, and personal exploration purposes only</strong>.
                </p>
              </div>
              
              <div className="border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-black p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Open Source & Free</h3>
                <p className="text-sm leading-relaxed">
                  This platform is a free, open demonstration of NASA&apos;s public APIs. All data is sourced 
                  directly from NASA&apos;s official API endpoints and other publicly available space data services.
                </p>
              </div>
              
              <div className="border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-black p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Data Attribution</h3>
                <p className="text-sm leading-relaxed">
                  All data, images, and information are credited to their respective sources:
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>• NASA (National Aeronautics and Space Administration)</li>
                  <li>• JPL (Jet Propulsion Laboratory)</li>
                  <li>• SSERVI (Solar System Exploration Research Virtual Institute)</li>
                  <li>• CelesTrak (TLE data)</li>
                  <li>• Other cited data providers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
              Purpose & Goals
            </h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong className="font-bold">Educational:</strong> Provide students, educators, and space enthusiasts 
                with accessible tools to explore and understand space data.
              </p>
              <p>
                <strong className="font-bold">Research:</strong> Support researchers and scientists by aggregating 
                multiple NASA data sources in one convenient location with visualization tools.
              </p>
              <p>
                <strong className="font-bold">Demonstration:</strong> Showcase the capabilities of modern web 
                technologies in creating interactive, data-rich applications.
              </p>
              <p>
                <strong className="font-bold">Accessibility:</strong> Make complex space data more approachable 
                through intuitive interfaces and visual representations.
              </p>
            </div>
          </div>

          {/* Developer Contact */}
          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
              👨‍💻 Connect with the Developer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <a 
                href="https://github.com/nihadishi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">🐙</div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider">GitHub</h3>
                    <p className="text-xs text-black/60 dark:text-white/60">@nihadishi</p>
                  </div>
                </div>
                <p className="text-sm text-black/70 dark:text-white/70">
                  Explore embedded systems projects, IoT applications, and this NASA API Explorer repository.
                </p>
                <div className="mt-4 text-xs font-bold uppercase text-blue-600 dark:text-blue-400 group-hover:underline">
                  Visit GitHub Profile →
                </div>
              </a>

              <a 
                href="https://linkedin.com/in/nihadishi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">💼</div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider">LinkedIn</h3>
                    <p className="text-xs text-black/60 dark:text-white/60">/in/nihadishi</p>
                  </div>
                </div>
                <p className="text-sm text-black/70 dark:text-white/70">
                  Connect for embedded engineering, IoT, edge computing, and space technology collaborations.
                </p>
                <div className="mt-4 text-xs font-bold uppercase text-blue-600 dark:text-blue-400 group-hover:underline">
                  Connect on LinkedIn →
                </div>
              </a>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-slate-700 dark:border-slate-600 text-center">
              <p className="text-sm text-black/60 dark:text-white/60">
                <strong className="font-bold">Specialization:</strong> C/C++ • Raspberry Pi • NVIDIA Jetson • STM32 • Embedded Linux
              </p>
            </div>
          </div>

          {/* Resources & Attribution */}
          {/* <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
              Resources & Attribution
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="font-bold">NASA Open APIs:</strong>{' '}
                <a 
                  href="https://api.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  https://api.nasa.gov/
                </a>
              </p>
              <p>
                <strong className="font-bold">Trek API Documentation:</strong>{' '}
                <a 
                  href="https://trek.nasa.gov/tiles/apidoc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  https://trek.nasa.gov/tiles/apidoc/
                </a>
              </p>
              <p>
                <strong className="font-bold">TLE Data:</strong>{' '}
                <a 
                  href="https://tle.ivanstanojevic.me/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  TLE API by Ivan Stanojevic
                </a>
              </p>
            </div>
        </div> */}

          {/* Footer Note */}
          <div className="border-t-4 border-slate-700 dark:border-slate-600 pt-8 text-center">
            <p className="text-sm text-black/60 dark:text-white/60">
              Built with passion for space exploration and open data by an embedded systems engineer.
            </p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-2">
              Last updated: October 2025 • This is an independent project and is not officially affiliated with NASA.
            </p>
            {/* <p className="text-xs text-black/50 dark:text-white/50 mt-1">
              From low-level C/C++ to high-level web - demonstrating versatility across the software stack.
            </p> */}
          </div>
          </div>
          </div>
        </div>
  );
}


