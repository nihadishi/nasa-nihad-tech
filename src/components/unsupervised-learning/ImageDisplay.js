"use client";

import Image from "next/image";

export default function ImageDisplay({ imagePreview, clusteredImage, processingTime }) {
  if (!imagePreview) return null;

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Original Image */}
        <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4">
            Original Image
          </h2>
          <div className="relative w-full aspect-square border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
            <Image
              src={imagePreview}
              alt="Original"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Clustered Image */}
        <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4">
            Clustered Result
          </h2>
          <div className="relative w-full aspect-square border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
            {clusteredImage ? (
              <Image
                src={clusteredImage}
                alt="Clustered"
                fill
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-black/40 dark:text-white/40">
                <p className="text-sm font-medium uppercase">
                  Process image to see result
                </p>
              </div>
            )}
          </div>
          {processingTime && (
            <p className="text-xs text-black/60 dark:text-white/60 mt-2">
              Total processing time: {processingTime}s
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

