import Link from "next/link";
import ApiUsageTracker from "./ApiUsageTracker";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Project Info */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">
              NASA API Explorer
            </h3>
            <p className="text-sm opacity-70 mb-4">
              Free educational platform for space data visualization
            </p>
            <Link 
              href="/about" 
              className="text-xs font-bold uppercase hover:underline"
            >
              → About Project
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
              Featured
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/apod" className="hover:underline">APOD</Link>
              <Link href="/iss" className="hover:underline">ISS</Link>
              <Link href="/ssc" className="hover:underline">SSC</Link>
              <Link href="/tle" className="hover:underline">TLE</Link>
              <Link href="/trek" className="hover:underline">Trek</Link>
              <Link href="/mars-rover" className="hover:underline">Mars Rover</Link>
              <Link href="/asteroids" className="hover:underline">Asteroids</Link>
              <Link href="/exoplanets" className="hover:underline">Exoplanets</Link>
            </div>
          </div>

          {/* Developer */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
              Developer
            </h3>
            <p className="text-sm opacity-70 mb-3">
              Embedded Software Engineer
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/nihadishi"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-black dark:border-white px-3 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                GitHub
              </a>
              <a 
                href="https://linkedin.com/in/nihadishi"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-black dark:border-white px-3 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-black dark:border-white pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <p className="font-bold uppercase">
              © {currentYear} • Non-Commercial Use Only
            </p>
            <p className="opacity-60">
              Not affiliated with NASA • Educational purposes only
            </p>
          </div>
          <ApiUsageTracker />
        </div>
      </div>
    </footer>
  );
}
