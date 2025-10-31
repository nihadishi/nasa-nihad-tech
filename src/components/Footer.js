import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white py-10 text-sm dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="nasa.nihad.tech logo" width={160} height={24} />
        </div>
        <p className="text-center text-zinc-600 dark:text-zinc-400 md:text-right">© {new Date().getFullYear()} nasa.nihad.tech · Unofficial fan project</p>
      </div>
    </footer>
  );
}


