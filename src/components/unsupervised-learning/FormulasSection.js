"use client";

export default function FormulasSection() {
  return (
    <section className="mb-12 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
      <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
        Mathematical Formulas
      </h2>
      
      <div className="space-y-8">
        {/* Euclidean Distance */}
        <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold uppercase mb-4">1. Euclidean Distance (Color Similarity)</h3>
          <p className="text-sm mb-4 text-black/70 dark:text-white/70">
            The distance between a pixel and a centroid is calculated using the Euclidean distance formula in 3D RGB space:
          </p>
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded border-2 border-slate-300 dark:border-slate-700 font-mono text-lg mb-4">
            <div className="text-center">
              <div className="mb-2">d(p, c) = √[(Rₚ - Rᴄ)² + (Gₚ - Gᴄ)² + (Bₚ - Bᴄ)²]</div>
              <div className="text-sm text-black/60 dark:text-white/60 mt-2">
                where: p = pixel, c = centroid
              </div>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p><strong>Theoretical formula (with square root):</strong></p>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded font-mono text-xs">
              <div>distance = Math.sqrt(</div>
              <div className="ml-4">Math.pow(pixel.r - centroid.r, 2) +</div>
              <div className="ml-4">Math.pow(pixel.g - centroid.g, 2) +</div>
              <div className="ml-4">Math.pow(pixel.b - centroid.b, 2)</div>
              <div>);</div>
            </div>
            <p className="text-black/60 dark:text-white/60 mt-2">
              <strong>Actual implementation (optimized):</strong> We use squared distance (without square root) for performance. Since we only need to compare distances to find the minimum, the square root is unnecessary:
            </p>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded font-mono text-xs">
              <div>distance = Math.pow(pixel.r - centroid.r, 2) +</div>
              <div className="ml-4">Math.pow(pixel.g - centroid.g, 2) +</div>
              <div className="ml-4">Math.pow(pixel.b - centroid.b, 2);</div>
              <div className="mt-2 text-black/60 dark:text-white/60 italic">Stored as squared distance (no square root)</div>
            </div>
            <p className="text-black/60 dark:text-white/60 mt-2">
              <strong>Why squared distance works:</strong> If d₁² &lt; d₂², then d₁ &lt; d₂, so comparing squared distances gives the same result as comparing actual distances.
            </p>
          </div>
        </div>

        {/* Centroid Update */}
        <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold uppercase mb-4">2. Centroid Update (Mean Calculation)</h3>
          <p className="text-sm mb-4 text-black/70 dark:text-white/70">
            After assigning all pixels to their nearest centroids, we update each centroid to be the mean (average) of all pixels in its cluster:
          </p>
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded border-2 border-slate-300 dark:border-slate-700 font-mono text-lg mb-4">
            <div className="space-y-3">
              <div className="text-center">
                <div className="mb-2">Rᴄ = (1/n) × Σ Rᵢ</div>
                <div className="text-sm text-black/60 dark:text-white/60">for all pixels i in cluster c</div>
              </div>
              <div className="text-center">
                <div className="mb-2">Gᴄ = (1/n) × Σ Gᵢ</div>
                <div className="text-sm text-black/60 dark:text-white/60">for all pixels i in cluster c</div>
              </div>
              <div className="text-center">
                <div className="mb-2">Bᴄ = (1/n) × Σ Bᵢ</div>
                <div className="text-sm text-black/60 dark:text-white/60">for all pixels i in cluster c</div>
              </div>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p><strong>Where:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-black/60 dark:text-white/60">
              <li>n = number of pixels in cluster c</li>
              <li>Rᵢ, Gᵢ, Bᵢ = RGB values of pixel i</li>
              <li>Rᴄ, Gᴄ, Bᴄ = new centroid RGB values</li>
            </ul>
            <p className="mt-4"><strong>In code:</strong></p>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded font-mono text-xs">
              <div className="text-black/60 dark:text-white/60 italic">First, accumulate sums for all pixels in cluster:</div>
              <div>cluster.r += pixel.r;</div>
              <div>cluster.g += pixel.g;</div>
              <div>cluster.b += pixel.b;</div>
              <div>cluster.count++;</div>
              <div className="mt-2 text-black/60 dark:text-white/60 italic">Then calculate mean:</div>
              <div>newR = Math.round(cluster.r / cluster.count);</div>
              <div>newG = Math.round(cluster.g / cluster.count);</div>
              <div>newB = Math.round(cluster.b / cluster.count);</div>
            </div>
          </div>
        </div>

        {/* Inertia */}
        <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold uppercase mb-4">3. Inertia (Within-Cluster Sum of Squares)</h3>
          <p className="text-sm mb-4 text-black/70 dark:text-white/70">
            Inertia measures how tightly grouped the clusters are. Lower inertia means better clustering:
          </p>
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded border-2 border-slate-300 dark:border-slate-700 font-mono text-lg mb-4">
            <div className="text-center">
              <div className="mb-2">Inertia = Σ d²(pᵢ, cⱼ)</div>
              <div className="text-sm text-black/60 dark:text-white/60 mt-2">
                for all pixels i assigned to centroid j
              </div>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-black/60 dark:text-white/60">
              This is the sum of squared distances from each pixel to its assigned centroid. The algorithm minimizes this value.
            </p>
            <p><strong>In code:</strong></p>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded font-mono text-xs">
              <div className="text-black/60 dark:text-white/60 italic">pixel.distance contains squared distance (d²)</div>
              <div>totalInertia = pixels.reduce((sum, pixel) =&gt; sum + pixel.distance, 0);</div>
              <div className="mt-2 text-black/60 dark:text-white/60 italic">This sums all squared distances</div>
            </div>
          </div>
        </div>

        {/* Algorithm Steps */}
        <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold uppercase mb-4">4. K-Means Algorithm Steps</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-2">Initialize Centroids</h4>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Randomly select K pixels as initial centroids: C = {'{'}c₁, c₂, ..., cₖ{'}'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-2">Assign Pixels</h4>
                <p className="text-sm text-black/60 dark:text-white/60 mb-2">
                  For each pixel pᵢ, find the nearest centroid:
                </p>
                <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded font-mono text-xs">
                  cⱼ = argmin d(pᵢ, cⱼ) for all j ∈ [1, K]
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-2">Update Centroids</h4>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Recalculate each centroid as the mean of all pixels in its cluster
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-2">Check Convergence</h4>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Repeat steps 2-3 until centroids stop moving or maximum iterations reached
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Convergence Criteria */}
        <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold uppercase mb-4">5. Convergence Criteria</h3>
          <p className="text-sm mb-4 text-black/70 dark:text-white/70">
            The algorithm stops when one of these conditions is met:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-green-600 dark:text-green-400 font-bold text-xl">✓</div>
              <div>
                <strong>Centroids unchanged:</strong> No centroid position changed between iterations
                <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded font-mono text-xs mt-1">
                  cⱼⁿ = cⱼⁿ⁻¹ for all j
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 font-bold text-xl">→</div>
              <div>
                <strong>Maximum iterations:</strong> Reached the iteration limit (default: 20)
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="border-2 border-slate-300 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold uppercase mb-4">6. Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-2">Average Squared Distance</h4>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded border-2 border-slate-300 dark:border-slate-700 font-mono text-sm mb-2">
                avgDistance = (1/n) × Σ d²(pᵢ, cⱼ)
              </div>
              <p className="text-sm text-black/60 dark:text-white/60 mb-2">
                Average squared distance from pixels to their cluster centroids (we use squared distance for performance)
              </p>
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded font-mono text-xs">
                <div>avgDistance = sumDistance / count</div>
                <div className="text-black/60 dark:text-white/60 mt-1 italic">where sumDistance = Σ d²(pᵢ, cⱼ)</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2">Maximum Squared Distance</h4>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded border-2 border-slate-300 dark:border-slate-700 font-mono text-sm mb-2">
                maxDistance = max(d²(pᵢ, cⱼ)) for all pixels i in cluster
              </div>
              <p className="text-sm text-black/60 dark:text-white/60 mb-2">
                The maximum squared distance from any pixel to its centroid in the cluster
              </p>
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded font-mono text-xs">
                <div>if (pixel.distance &gt; maxDistance) maxDistance = pixel.distance;</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2">Cluster Percentage</h4>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded border-2 border-slate-300 dark:border-slate-700 font-mono text-sm mb-2">
                percentage = (nᵢ / N) × 100%
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Where nᵢ = pixels in cluster i, N = total pixels
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

