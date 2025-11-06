"use client";

export default function InformationSection() {
  return (
    <section className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
      <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
        How It Works
      </h2>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          <strong className="font-bold">K-Means Clustering</strong> is an
          unsupervised machine learning algorithm that groups similar data
          points together. In this implementation:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
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
        <p className="mt-4">
          This technique is useful for image compression, color quantization,
          and discovering dominant color patterns in images.
        </p>
      </div>
    </section>
  );
}

