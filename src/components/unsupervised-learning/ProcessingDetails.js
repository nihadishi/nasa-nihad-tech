"use client";

export default function ProcessingDetails({ processingDetails }) {
  if (!processingDetails) return null;

  return (
    <section className="mb-12">
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
          Processing Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Algorithm Metrics */}
          <div className="border-2 border-slate-300 dark:border-slate-700 p-4">
            <h3 className="text-lg font-bold uppercase mb-4">Algorithm Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Algorithm:</span>
                <span className="font-bold">{processingDetails.algorithm === "isodata" ? "ISODATA" : "K-Means"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Clusters:</span>
                <span className="font-bold font-mono">{processingDetails.clusters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Iterations:</span>
                <span className="font-bold font-mono">{processingDetails.iterations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Converged:</span>
                <span className="font-bold">{processingDetails.converged ? "✓ Yes" : "✗ No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Total Inertia:</span>
                <span className="font-bold font-mono">{processingDetails.totalInertia}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Processed Pixels:</span>
                <span className="font-bold font-mono">{processingDetails.totalPixels.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="border-2 border-slate-300 dark:border-slate-700 p-4">
            <h3 className="text-lg font-bold uppercase mb-4">Performance Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Total Time:</span>
                <span className="font-bold font-mono">{processingDetails.timings.total}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Image Load:</span>
                <span className="font-bold font-mono">{processingDetails.timings.imageLoad}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Data Extraction:</span>
                <span className="font-bold font-mono">{processingDetails.timings.dataExtraction}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Clustering:</span>
                <span className="font-bold font-mono">{processingDetails.timings.clustering}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 dark:text-white/60">Rendering:</span>
                <span className="font-bold font-mono">{processingDetails.timings.rendering}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Iteration Details */}
        {processingDetails.iterationDetails && processingDetails.iterationDetails.length > 0 && (
          <div className="border-2 border-slate-300 dark:border-slate-700 p-4">
            <h3 className="text-lg font-bold uppercase mb-4">Iteration Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th className="text-left py-2 px-2 font-bold uppercase">Iteration</th>
                    {processingDetails.algorithm === "isodata" && (
                      <th className="text-right py-2 px-2 font-bold uppercase">Clusters</th>
                    )}
                    <th className="text-right py-2 px-2 font-bold uppercase">Pixels Changed</th>
                    <th className="text-right py-2 px-2 font-bold uppercase">Centroids Moved</th>
                    <th className="text-right py-2 px-2 font-bold uppercase">Inertia</th>
                    <th className="text-right py-2 px-2 font-bold uppercase">Time (ms)</th>
                    <th className="text-center py-2 px-2 font-bold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processingDetails.iterationDetails.map((detail, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b border-slate-200 dark:border-slate-800"
                    >
                      <td className="py-2 px-2 font-mono">{detail.iteration}</td>
                      {processingDetails.algorithm === "isodata" && (
                        <td className="py-2 px-2 text-right font-mono">{detail.clustersCount || processingDetails.clusters}</td>
                      )}
                      <td className="py-2 px-2 text-right font-mono">{detail.pixelsChanged.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-mono">{detail.centroidsMoved}</td>
                      <td className="py-2 px-2 text-right font-mono">{detail.inertia}</td>
                      <td className="py-2 px-2 text-right font-mono">{detail.time}</td>
                      <td className="py-2 px-2 text-center">
                        {detail.converged ? (
                          <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400">→</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

