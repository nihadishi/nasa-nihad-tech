export const metadata = {
  title: "NASA — About",
  description: "About the National Aeronautics and Space Administration.",
};

export default function AboutPage() {
  return (
    <main className="min-h-[60vh] bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
      <section className="border-b border-zinc-200/70 bg-white py-16 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">About NASA</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">We pioneer the future in space exploration, scientific discovery, and aeronautics research.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Mission</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">To reveal the unknown for the benefit of humankind.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Vision</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">To reach for new heights and uncover the secrets of the universe.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Values</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Safety, integrity, teamwork, excellence, and inclusion.</p>
          </div>
        </div>
      </section>
    </main>
  );
}


