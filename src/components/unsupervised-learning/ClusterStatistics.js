"use client";

export default function ClusterStatistics({ clusterStats }) {
  if (!clusterStats) return null;

  return (
    <section className="mb-12">
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
          Cluster Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusterStats.map((stat) => (
            <div
              key={stat.cluster}
              className="border-2 border-slate-300 dark:border-slate-700 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 border-2 border-black dark:border-white"
                  style={{ backgroundColor: stat.color }}
                ></div>
                <div>
                  <div className="text-lg font-bold">
                    Cluster {stat.cluster + 1}
                  </div>
                  <div className="text-xs text-black/60 dark:text-white/60">
                    {stat.percentage}% of pixels
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono space-y-1">
                <div>RGB: ({stat.centroid.r}, {stat.centroid.g}, {stat.centroid.b})</div>
                <div>Pixels: {stat.count.toLocaleString()}</div>
                {stat.avgDistance && (
                  <>
                    <div>Avg Distance: {stat.avgDistance}</div>
                    <div>Max Distance: {stat.maxDistance}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

