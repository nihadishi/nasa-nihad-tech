"use client";

export default function ImageUploadControls({ 
  fileInputRef, 
  imagePreview, 
  clusters, 
  setClusters, 
  onImageSelect, 
  onProcessImage, 
  processing 
}) {
  return (
    <section className="mb-12">
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
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
      </div>
    </section>
  );
}

