"use client";

export default function ProcessingProgress({ processing, currentStep, progress }) {
  if (!processing) return null;

  return (
    <section className="mb-12">
      <div className="border-4 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-8">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-4">
          Processing Status
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold uppercase">{currentStep}</span>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-6 border-2 border-slate-700 dark:border-slate-600">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

