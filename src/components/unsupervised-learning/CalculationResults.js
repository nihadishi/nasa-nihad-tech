"use client";

export default function CalculationResults({ processingDetails, clusterStats, pixelMatrix, originalImageData }) {
  if (!processingDetails || !clusterStats || !pixelMatrix) return null;

  // Get some example calculations
  const getExampleCalculations = () => {
    if (!clusterStats || clusterStats.length === 0) return null;

    // Example 1: Show distance calculation for a pixel
    const exampleCluster = clusterStats[0];
    const centroid = exampleCluster.centroid;
    
    // Get a sample pixel from the original image data (middle of image) if available, otherwise use clustered data
    const midX = Math.floor(pixelMatrix.width / 2);
    const midY = Math.floor(pixelMatrix.height / 2);
    const samplePixel = originalImageData 
      ? originalImageData.data[midY]?.[midX] 
      : pixelMatrix.data[midY]?.[midX];
    
    if (!samplePixel) return null;

    // Calculate distance from sample pixel to first centroid
    const deltaR = samplePixel.r - centroid.r;
    const deltaG = samplePixel.g - centroid.g;
    const deltaB = samplePixel.b - centroid.b;
    const squaredDistance = deltaR * deltaR + deltaG * deltaG + deltaB * deltaB;
    const distance = Math.sqrt(squaredDistance);

    // Find which cluster this pixel belongs to
    let assignedCluster = null;
    let minDist = Infinity;
    clusterStats.forEach((stat) => {
      const dR = samplePixel.r - stat.centroid.r;
      const dG = samplePixel.g - stat.centroid.g;
      const dB = samplePixel.b - stat.centroid.b;
      const dist = dR * dR + dG * dG + dB * dB;
      if (dist < minDist) {
        minDist = dist;
        assignedCluster = stat;
      }
    });

    return {
      samplePixel: { x: midX, y: midY, ...samplePixel },
      centroid,
      deltaR,
      deltaG,
      deltaB,
      squaredDistance,
      distance,
      assignedCluster,
      minDist,
    };
  };

  const example = getExampleCalculations();

  return (
    <section className="mb-12 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
      <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
        Calculation Results
      </h2>

      <div className="space-y-6">
        {/* Example Distance Calculation */}
        {example && (
          <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold uppercase mb-4">
              Example: Distance Calculation
            </h3>
            <p className="text-sm mb-4 text-black/70 dark:text-white/70">
              Calculating the distance from a sample pixel to Cluster 1 centroid:
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-300 dark:border-slate-700">
                  <h4 className="font-bold mb-2">Sample Pixel at ({example.samplePixel.x}, {example.samplePixel.y})</h4>
                  <div className="space-y-1 font-mono text-sm">
                    <div>R = <span className="text-red-600 dark:text-red-400 font-bold">{example.samplePixel.r}</span></div>
                    <div>G = <span className="text-green-600 dark:text-green-400 font-bold">{example.samplePixel.g}</span></div>
                    <div>B = <span className="text-blue-600 dark:text-blue-400 font-bold">{example.samplePixel.b}</span></div>
                    <div className="mt-2">
                      <div
                        className="w-16 h-16 border-2 border-black dark:border-white"
                        style={{ backgroundColor: `rgb(${example.samplePixel.r}, ${example.samplePixel.g}, ${example.samplePixel.b})` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-300 dark:border-slate-700">
                  <h4 className="font-bold mb-2">Cluster 1 Centroid</h4>
                  <div className="space-y-1 font-mono text-sm">
                    <div>R = <span className="text-red-600 dark:text-red-400 font-bold">{example.centroid.r}</span></div>
                    <div>G = <span className="text-green-600 dark:text-green-400 font-bold">{example.centroid.g}</span></div>
                    <div>B = <span className="text-blue-600 dark:text-blue-400 font-bold">{example.centroid.b}</span></div>
                    <div className="mt-2">
                      <div
                        className="w-16 h-16 border-2 border-black dark:border-white"
                        style={{ backgroundColor: `rgb(${example.centroid.r}, ${example.centroid.g}, ${example.centroid.b})` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded border-2 border-slate-300 dark:border-slate-700">
                <h4 className="font-bold mb-3">Step-by-Step Calculation:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div>
                    <strong>1. Calculate differences (Δ):</strong>
                    <div className="ml-4 mt-1 space-y-1">
                      <div>ΔR = Rₚ - Rᴄ = {example.samplePixel.r} - {example.centroid.r} = <span className="text-red-600 dark:text-red-400 font-bold">{example.deltaR}</span></div>
                      <div>ΔG = Gₚ - Gᴄ = {example.samplePixel.g} - {example.centroid.g} = <span className="text-green-600 dark:text-green-400 font-bold">{example.deltaG}</span></div>
                      <div>ΔB = Bₚ - Bᴄ = {example.samplePixel.b} - {example.centroid.b} = <span className="text-blue-600 dark:text-blue-400 font-bold">{example.deltaB}</span></div>
                    </div>
                  </div>
                  <div>
                    <strong>2. Calculate squared differences:</strong>
                    <div className="ml-4 mt-1 space-y-1">
                      <div>(ΔR)² = ({example.deltaR})² = <span className="font-bold">{example.deltaR * example.deltaR}</span></div>
                      <div>(ΔG)² = ({example.deltaG})² = <span className="font-bold">{example.deltaG * example.deltaG}</span></div>
                      <div>(ΔB)² = ({example.deltaB})² = <span className="font-bold">{example.deltaB * example.deltaB}</span></div>
                    </div>
                  </div>
                  <div>
                    <strong>3. Sum squared differences:</strong>
                    <div className="ml-4 mt-1">
                      <div>d² = (ΔR)² + (ΔG)² + (ΔB)²</div>
                      <div>d² = {example.deltaR * example.deltaR} + {example.deltaG * example.deltaG} + {example.deltaB * example.deltaB}</div>
                      <div>d² = <span className="font-bold text-lg">{example.squaredDistance.toFixed(2)}</span></div>
                    </div>
                  </div>
                  <div>
                    <strong>4. Calculate actual distance (for display):</strong>
                    <div className="ml-4 mt-1">
                      <div>d = √d² = √{example.squaredDistance.toFixed(2)}</div>
                      <div>d = <span className="font-bold text-lg">{example.distance.toFixed(2)}</span></div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700">
                    <strong>Result:</strong> This pixel is assigned to <span className="font-bold">Cluster {example.assignedCluster?.cluster + 1}</span> 
                    (distance: {Math.sqrt(example.minDist).toFixed(2)})
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Centroid Evolution */}
        {clusterStats && clusterStats.length > 0 && clusterStats[0].initialCentroid && (
          <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold uppercase mb-4">
              Centroid Evolution (Initial → Final)
            </h3>
            <p className="text-sm mb-4 text-black/70 dark:text-white/70">
              How centroids moved during the clustering process:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-bold uppercase">Cluster</th>
                    <th className="text-center py-3 px-4 font-bold uppercase">Initial RGB</th>
                    <th className="text-center py-3 px-4 font-bold uppercase">Final RGB</th>
                    <th className="text-center py-3 px-4 font-bold uppercase">Change (Δ)</th>
                    <th className="text-center py-3 px-4 font-bold uppercase">Total Movement</th>
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
                        <td className="py-3 px-4 font-bold">#{stat.cluster + 1}</td>
                        <td className="py-3 px-4 text-center font-mono">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-8 h-8 border border-black dark:border-white"
                              style={{ backgroundColor: `rgb(${stat.initialCentroid.r}, ${stat.initialCentroid.g}, ${stat.initialCentroid.b})` }}
                            ></div>
                            <div>
                              <span className="text-red-600 dark:text-red-400">{stat.initialCentroid.r}</span>
                              {', '}
                              <span className="text-green-600 dark:text-green-400">{stat.initialCentroid.g}</span>
                              {', '}
                              <span className="text-blue-600 dark:text-blue-400">{stat.initialCentroid.b}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-8 h-8 border border-black dark:border-white"
                              style={{ backgroundColor: stat.color }}
                            ></div>
                            <div>
                              <span className="text-red-600 dark:text-red-400">{stat.centroid.r}</span>
                              {', '}
                              <span className="text-green-600 dark:text-green-400">{stat.centroid.g}</span>
                              {', '}
                              <span className="text-blue-600 dark:text-blue-400">{stat.centroid.b}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          <div>
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
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {totalDelta.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-black/60 dark:text-white/60 mt-3">
              <strong>Formula:</strong> Total Movement = √[(ΔR)² + (ΔG)² + (ΔB)²]
            </p>
          </div>
        )}

        {/* Inertia Progression */}
        {processingDetails.iterationDetails && processingDetails.iterationDetails.length > 0 && (
          <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold uppercase mb-4">
              Inertia Progression
            </h3>
            <p className="text-sm mb-4 text-black/70 dark:text-white/70">
              How the total inertia (sum of squared distances) changed during iterations:
            </p>
            <div className="space-y-3">
              {processingDetails.iterationDetails.map((detail, idx) => {
                const prevInertia = idx > 0 ? parseFloat(processingDetails.iterationDetails[idx - 1].inertia) : null;
                const currentInertia = parseFloat(detail.inertia);
                const improvement = prevInertia !== null ? ((prevInertia - currentInertia) / prevInertia * 100) : 0;
                
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-300 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold">Iteration {detail.iteration}</div>
                      <div className="font-mono text-sm">
                        Inertia: <span className="font-bold text-lg">{detail.inertia}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-black/60 dark:text-white/60">Pixels Changed:</span>
                        <span className="ml-2 font-bold">{detail.pixelsChanged.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-black/60 dark:text-white/60">Centroids Moved:</span>
                        <span className="ml-2 font-bold">{detail.centroidsMoved}</span>
                      </div>
                      <div>
                        <span className="text-black/60 dark:text-white/60">Time:</span>
                        <span className="ml-2 font-bold">{detail.time}ms</span>
                      </div>
                      {prevInertia !== null && (
                        <div>
                          <span className="text-black/60 dark:text-white/60">Improvement:</span>
                          <span className={`ml-2 font-bold ${improvement > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {improvement > 0 ? '-' : '+'}{Math.abs(improvement).toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                    {prevInertia !== null && (
                      <div className="mt-2 text-xs text-black/60 dark:text-white/60">
                        <strong>Calculation:</strong> Improvement = (({prevInertia.toFixed(2)} - {currentInertia.toFixed(2)}) / {prevInertia.toFixed(2)}) × 100% = {improvement > 0 ? '-' : ''}{Math.abs(improvement).toFixed(2)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-black/60 dark:text-white/60 mt-4">
              <strong>Note:</strong> Lower inertia is better. The algorithm minimizes this value. 
              Total Inertia = Σ d²(pᵢ, cⱼ) for all pixels i assigned to centroid j.
            </p>
          </div>
        )}

        {/* Mean Calculation Example */}
        {clusterStats && clusterStats.length > 0 && (
          <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold uppercase mb-4">
              Centroid Mean Calculation Example
            </h3>
            <p className="text-sm mb-4 text-black/70 dark:text-white/70">
              How Cluster 1 centroid was calculated as the mean of all assigned pixels:
            </p>
            {(() => {
              const exampleCluster = clusterStats[0];
              const totalPixels = processingDetails.totalPixels;
              const clusterPixels = exampleCluster.count;
              const avgR = exampleCluster.centroid.r;
              const avgG = exampleCluster.centroid.g;
              const avgB = exampleCluster.centroid.b;
              
              return (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-300 dark:border-slate-700">
                  <div className="space-y-3 font-mono text-sm">
                    <div>
                      <strong>Cluster 1 Statistics:</strong>
                      <div className="ml-4 mt-1 space-y-1">
                        <div>Number of pixels (n) = <span className="font-bold">{clusterPixels.toLocaleString()}</span></div>
                        <div>Percentage of image = <span className="font-bold">{exampleCluster.percentage}%</span></div>
                      </div>
                    </div>
                    <div>
                      <strong>Mean Calculation:</strong>
                      <div className="ml-4 mt-1 space-y-1">
                        <div>Rᴄ = (1/n) × Σ Rᵢ = (1/{clusterPixels.toLocaleString()}) × Σ Rᵢ = <span className="font-bold text-red-600 dark:text-red-400">{avgR}</span></div>
                        <div>Gᴄ = (1/n) × Σ Gᵢ = (1/{clusterPixels.toLocaleString()}) × Σ Gᵢ = <span className="font-bold text-green-600 dark:text-green-400">{avgG}</span></div>
                        <div>Bᴄ = (1/n) × Σ Bᵢ = (1/{clusterPixels.toLocaleString()}) × Σ Bᵢ = <span className="font-bold text-blue-600 dark:text-blue-400">{avgB}</span></div>
                      </div>
                    </div>
                    <div>
                      <strong>Final Centroid:</strong>
                      <div className="ml-4 mt-2 flex items-center gap-3">
                        <div
                          className="w-16 h-16 border-2 border-black dark:border-white"
                          style={{ backgroundColor: exampleCluster.color }}
                        ></div>
                        <div>
                          <div>RGB({avgR}, {avgG}, {avgB})</div>
                          <div className="text-xs text-black/60 dark:text-white/60">Average of {clusterPixels.toLocaleString()} pixels</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Convergence Analysis */}
        {processingDetails.converged && (
          <div className="border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950/20 p-6">
            <h3 className="text-lg font-bold uppercase mb-2 text-green-700 dark:text-green-400">
              ✓ Algorithm Converged
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70">
              The algorithm converged after {processingDetails.iterations} iterations. 
              This means no centroids moved in the final iteration, indicating the optimal clustering was found.
            </p>
            <div className="mt-3 font-mono text-sm">
              <div>Convergence condition: cⱼⁿ = cⱼⁿ⁻¹ for all centroids j</div>
            </div>
          </div>
        )}

        {!processingDetails.converged && (
          <div className="border-2 border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 p-6">
            <h3 className="text-lg font-bold uppercase mb-2 text-yellow-700 dark:text-yellow-400">
              → Maximum Iterations Reached
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70">
              The algorithm reached the maximum iteration limit ({processingDetails.iterations} iterations) 
              before convergence. The centroids may still be moving, but the algorithm stopped to prevent excessive computation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

