"use client";

export default function ColorDecompositionMatrix({ clusterStats }) {
  if (!clusterStats) return null;

  return (
    <section className="mb-12">
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
          Color Decomposition Matrix
        </h2>
        
        {/* Color Palette Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-bold uppercase mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {clusterStats
              .sort((a, b) => b.count - a.count)
              .map((stat) => (
                <div
                  key={stat.cluster}
                  className="border-2 border-slate-300 dark:border-slate-700 overflow-hidden"
                >
                  <div
                    className="w-full h-24 border-b-2 border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900">
                    <div className="text-xs font-bold mb-1">
                      Cluster {stat.cluster + 1}
                    </div>
                    <div className="text-xs font-mono text-black/60 dark:text-white/60">
                      {stat.percentage}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* RGB Decomposition Table */}
        <div className="mb-8">
          <h3 className="text-lg font-bold uppercase mb-4">RGB Value Decomposition</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-4 border-slate-700 dark:border-slate-600">
                  <th className="text-left py-3 px-4 font-bold uppercase">Cluster</th>
                  <th className="text-center py-3 px-4 font-bold uppercase">Color</th>
                  <th className="text-right py-3 px-4 font-bold uppercase font-mono">R</th>
                  <th className="text-right py-3 px-4 font-bold uppercase font-mono">G</th>
                  <th className="text-right py-3 px-4 font-bold uppercase font-mono">B</th>
                  <th className="text-right py-3 px-4 font-bold uppercase font-mono">Hex</th>
                  <th className="text-right py-3 px-4 font-bold uppercase">Pixels</th>
                  <th className="text-right py-3 px-4 font-bold uppercase">%</th>
                </tr>
              </thead>
              <tbody>
                {clusterStats
                  .sort((a, b) => b.count - a.count)
                  .map((stat) => {
                    const hex = `#${stat.centroid.r.toString(16).padStart(2, '0')}${stat.centroid.g.toString(16).padStart(2, '0')}${stat.centroid.b.toString(16).padStart(2, '0')}`.toUpperCase();
                    return (
                      <tr
                        key={stat.cluster}
                        className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <td className="py-3 px-4 font-bold">#{stat.cluster + 1}</td>
                        <td className="py-3 px-4">
                          <div
                            className="w-12 h-12 mx-auto border-2 border-black dark:border-white"
                            style={{ backgroundColor: stat.color }}
                          ></div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          <span className="text-red-600 dark:text-red-400 font-bold">
                            {stat.centroid.r}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            {stat.centroid.g}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            {stat.centroid.b}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs">
                          {hex}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          {stat.count.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          {stat.percentage}%
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Initial vs Final Centroids Comparison */}
        {clusterStats[0]?.initialCentroid && (
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Centroid Evolution (Initial → Final)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th className="text-left py-2 px-3 font-bold uppercase">Cluster</th>
                    <th className="text-center py-2 px-3 font-bold uppercase">Initial RGB</th>
                    <th className="text-center py-2 px-3 font-bold uppercase">Final RGB</th>
                    <th className="text-center py-2 px-3 font-bold uppercase">Change (Δ)</th>
                  </tr>
                </thead>
                <tbody>
                  {clusterStats.map((stat) => {
                    const rDelta = stat.centroid.r - stat.initialCentroid.r;
                    const gDelta = stat.centroid.g - stat.initialCentroid.g;
                    const bDelta = stat.centroid.b - stat.initialCentroid.b;
                    const totalDelta = Math.sqrt(rDelta * rDelta + gDelta * gDelta + bDelta * bDelta);
                    return (
                      <tr
                        key={stat.cluster}
                        className="border-b border-slate-200 dark:border-slate-800"
                      >
                        <td className="py-2 px-3 font-bold">#{stat.cluster + 1}</td>
                        <td className="py-2 px-3 text-center font-mono">
                          <span className="text-red-600 dark:text-red-400">{stat.initialCentroid.r}</span>
                          {', '}
                          <span className="text-green-600 dark:text-green-400">{stat.initialCentroid.g}</span>
                          {', '}
                          <span className="text-blue-600 dark:text-blue-400">{stat.initialCentroid.b}</span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          <span className="text-red-600 dark:text-red-400">{stat.centroid.r}</span>
                          {', '}
                          <span className="text-green-600 dark:text-green-400">{stat.centroid.g}</span>
                          {', '}
                          <span className="text-blue-600 dark:text-blue-400">{stat.centroid.b}</span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          <span className={rDelta !== 0 ? 'text-red-600 dark:text-red-400' : ''}>
                            {rDelta > 0 ? '+' : ''}{rDelta}
                          </span>
                          {', '}
                          <span className={gDelta !== 0 ? 'text-green-600 dark:text-green-400' : ''}>
                            {gDelta > 0 ? '+' : ''}{gDelta}
                          </span>
                          {', '}
                          <span className={bDelta !== 0 ? 'text-blue-600 dark:text-blue-400' : ''}>
                            {bDelta > 0 ? '+' : ''}{bDelta}
                          </span>
                          <div className="text-xs text-black/60 dark:text-white/60 mt-1">
                            Total: {totalDelta.toFixed(1)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

