import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t-4 border-slate-700 dark:border-slate-600 bg-[#F5F5F0] dark:bg-[#1a1a1a] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="nasa.nihad.tech logo" width={160} height={24} />
        </div>
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-center text-sm font-bold uppercase tracking-wider md:text-right">
            © {new Date().getFullYear()} nasa.nihad.tech
          </p>
          <p className="text-xs font-medium opacity-60">
            Unofficial fan project · Not affiliated with NASA
          </p>
        </div>
      </div>
    </footer>
  );
}
