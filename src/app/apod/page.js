import Image from "next/image";

export const metadata = {
  title: "APOD — Astronomy Picture of the Day",
  description: "Daily NASA Astronomy Picture of the Day with metadata.",
};

async function getApod() {
  const key = process.env.NASA_API_KEY;
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&thumbs=true`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function ApodPage() {
  const data = await getApod();
  return (
    <main className="min-h-[70vh] bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section className="border-b border-zinc-200/70 py-16 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">NASA APOD</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Astronomy Picture of the Day</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">Daily imagery and videos from NASA’s APOD feed with details and source links.</p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          {!data ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm shadow-sm dark:border-zinc-800 dark:bg-black">Unable to load APOD right now. Try again later.</div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr,1fr]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-black">
                {data.media_type === "image" ? (
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    <Image
                      src={data.url || data.hdurl}
                      alt={data.title}
                      fill
                      sizes="(min-width: 768px) 60vw, 100vw"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl">
                    <video controls poster={data.thumbnail_url || data.url} className="aspect-video h-auto w-full">
                      <source src={data.url} />
                    </video>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{data.title}</h2>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">{data.date}{data.copyright ? ` · © ${data.copyright}` : ""}</div>
                </div>
                <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">{data.explanation}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href={data.url || data.hdurl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white ring-1 ring-zinc-900/10 transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:ring-zinc-100/20 dark:hover:bg-zinc-200">Open media</a>
                  {data.url ? (
                    <a href={data.hdurl || data.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900">Open HD</a>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


