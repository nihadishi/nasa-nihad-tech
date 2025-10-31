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
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <section className="border-b-4 border-black dark:border-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-3">NASA APOD</div>
          <h1 className="text-5xl font-bold uppercase tracking-tight md:text-6xl">
            Astronomy Picture<br />of the Day
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium">
            Daily imagery and videos from NASA&apos;s APOD feed with details and source links.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {!data ? (
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-12 text-center">
              <p className="text-lg font-bold uppercase tracking-wider">
                Unable to load APOD right now. Try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr,1fr]">
              <div className="border-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 p-4">
                {data.media_type === "image" ? (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={data.url || data.hdurl}
                      alt={data.title}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    <video 
                      controls 
                      poster={data.thumbnail_url || data.url} 
                      className="aspect-video h-auto w-full"
                    >
                      <source src={data.url} />
                    </video>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-8">
                <div className="border-l-4 border-black dark:border-white pl-6">
                  <h2 className="text-3xl font-bold leading-tight mb-3">
                    {data.title}
                  </h2>
                  <div className="text-sm font-bold uppercase tracking-wider">
                    {data.date}
                    {data.copyright && ` · © ${data.copyright}`}
                  </div>
                </div>

                <div className="border-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 p-6">
                  <p className="text-sm leading-relaxed font-medium">
                    {data.explanation}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a 
                    href={data.url || data.hdurl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center justify-center border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
                  >
                    View Media
                  </a>
                  {data.hdurl && (
                    <a 
                      href={data.hdurl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center justify-center border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                      HD Version
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
