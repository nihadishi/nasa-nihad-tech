"use client";

export default function ImageInfo({ imageInfo, clusters }) {
  if (!imageInfo) return null;

  return (
    <section className="mb-6">
      <div className="border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-black p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs font-bold uppercase text-black/60 dark:text-white/60">Dimensions</div>
            <div className="font-mono font-bold">{imageInfo.width} × {imageInfo.height}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-black/60 dark:text-white/60">Total Pixels</div>
            <div className="font-mono font-bold">{imageInfo.pixels.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-black/60 dark:text-white/60">File Size</div>
            <div className="font-mono font-bold">{imageInfo.size}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-black/60 dark:text-white/60">Clusters (K)</div>
            <div className="font-mono font-bold">{clusters}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

