"use client";

export default function ImageUploadControls({ 
  fileInputRef, 
  imagePreview, 
  algorithm,
  setAlgorithm,
  clusters, 
  setClusters,
  minClusters,
  setMinClusters,
  maxClusters,
  setMaxClusters,
  mergeThreshold,
  setMergeThreshold,
  splitThreshold,
  setSplitThreshold,
  minClusterSize,
  setMinClusterSize,
  onImageSelect, 
  onProcessImage, 
  processing 
}) {
  return (
    <section className="mb-12">
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
        <div className="space-y-6">
          {/* Algorithm Selection */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-3">
              Clustering Algorithm
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setAlgorithm("kmeans")}
                className={`flex-1 border-4 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all ${
                  algorithm === "kmeans"
                    ? "border-purple-600 dark:border-purple-500 bg-purple-600 dark:bg-purple-500 text-white shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black hover:border-slate-500 dark:hover:border-slate-500"
                }`}
              >
                K-Means
              </button>
              <button
                onClick={() => setAlgorithm("isodata")}
                className={`flex-1 border-4 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all ${
                  algorithm === "isodata"
                    ? "border-purple-600 dark:border-purple-500 bg-purple-600 dark:bg-purple-500 text-white shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black hover:border-slate-500 dark:hover:border-slate-500"
                }`}
              >
                ISODATA
              </button>
            </div>
            <p className="text-xs text-black/60 dark:text-white/60 mt-2">
              {algorithm === "kmeans" 
                ? "Fixed number of clusters. Fast and simple."
                : "Dynamic clusters. Can merge/split clusters automatically."}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                Upload Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
              >
                {imagePreview ? "Change Image" : "Select Image"}
              </button>
            </div>

            {algorithm === "kmeans" ? (
              <div className="flex-1">
                <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                  Number of Clusters (K)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={clusters}
                    onChange={(e) => setClusters(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold w-12 text-center">
                    {clusters}
                  </span>
                </div>
                <p className="text-xs text-black/60 dark:text-white/60 mt-2">
                  More clusters = more detail, but slower processing
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                    Initial Clusters
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={clusters}
                      onChange={(e) => setClusters(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold w-12 text-center">
                      {clusters}
                    </span>
                  </div>
                  <p className="text-xs text-black/60 dark:text-white/60 mt-2">
                    Starting number of clusters (may change during processing)
                  </p>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                    Min Clusters
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={minClusters}
                      onChange={(e) => setMinClusters(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold w-12 text-center">
                      {minClusters}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                    Max Clusters
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={maxClusters}
                      onChange={(e) => setMaxClusters(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold w-12 text-center">
                      {maxClusters}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="flex-1 flex items-end">
              <button
                onClick={onProcessImage}
                disabled={!imagePreview || processing}
                className="w-full border-4 border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-none"
              >
                {processing ? "Processing..." : "Process Image"}
              </button>
            </div>
          </div>

          {/* ISODATA Advanced Parameters */}
          {algorithm === "isodata" && (
            <div className="border-2 border-slate-300 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                ISODATA Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                    Merge Threshold
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={mergeThreshold}
                      onChange={(e) => setMergeThreshold(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold w-12 text-center">
                      {mergeThreshold}
                    </span>
                  </div>
                  <p className="text-xs text-black/60 dark:text-white/60 mt-1">
                    Clusters closer than this will merge
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                    Split Threshold
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={splitThreshold}
                      onChange={(e) => setSplitThreshold(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold w-12 text-center">
                      {splitThreshold}
                    </span>
                  </div>
                  <p className="text-xs text-black/60 dark:text-white/60 mt-1">
                    Clusters with std dev above this will split
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                    Min Cluster Size
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={minClusterSize}
                      onChange={(e) => setMinClusterSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold w-12 text-center">
                      {minClusterSize}
                    </span>
                  </div>
                  <p className="text-xs text-black/60 dark:text-white/60 mt-1">
                    Clusters with fewer pixels will be removed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

