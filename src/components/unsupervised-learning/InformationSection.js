"use client";

export default function InformationSection() {
  return (
    <section className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
      <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
        How It Works
      </h2>
      <div className="space-y-6 text-sm leading-relaxed">
        {/* K-Means Section */}
        <div>
          <p>
            <strong className="font-bold">K-Means Clustering</strong> is an
            unsupervised machine learning algorithm that groups similar data
            points together. In this implementation:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>
              Each pixel in your image is represented by its RGB color values
            </li>
            <li>
              The algorithm randomly initializes K cluster centers (centroids)
            </li>
            <li>
              It iteratively assigns each pixel to the nearest centroid and
              updates the centroids based on the assigned pixels
            </li>
            <li>
              The process continues until convergence or maximum iterations
            </li>
            <li>
              The final result shows your image with each pixel colored by its
              assigned cluster centroid
            </li>
          </ul>
          <p className="mt-2 text-black/60 dark:text-white/60">
            <strong>Best for:</strong> Fast processing with a fixed number of clusters. Simple and predictable.
          </p>
        </div>

        {/* ISODATA Section */}
        <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-4">
          <p>
            <strong className="font-bold">ISODATA (Iterative Self-Organizing Data Analysis Technique)</strong> is an
            advanced clustering algorithm that extends K-means with dynamic cluster management:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>
              Starts with an initial number of clusters (like K-means)
            </li>
            <li>
              <strong>Merges</strong> clusters that are too close together (below merge threshold)
            </li>
            <li>
              <strong>Splits</strong> clusters that are too spread out (above split threshold)
            </li>
            <li>
              <strong>Removes</strong> clusters with too few pixels (below minimum cluster size)
            </li>
            <li>
              Automatically finds the optimal number of clusters within min/max bounds
            </li>
            <li>
              More adaptive but slower than K-means due to merge/split operations
            </li>
          </ul>
          <p className="mt-2 text-black/60 dark:text-white/60">
            <strong>Best for:</strong> When you don&apos;t know the optimal number of clusters. More flexible but requires parameter tuning.
          </p>
        </div>

        <p className="mt-4 pt-4 border-t-2 border-slate-300 dark:border-slate-700">
          Both techniques are useful for image compression, color quantization,
          and discovering dominant color patterns in images.
        </p>
      </div>
    </section>
  );
}

