"use client";

import { useState, useRef } from "react";
import {
  ImageUploadControls,
  ProcessingProgress,
  ImageInfo,
  ImageDisplay,
  ProcessingDetails,
  ClusterStatistics,
  ColorDecompositionMatrix,
  ImageMatrixView,
  FullScreenMatrixPreview,
  InformationSection,
  kMeansClustering,
} from "@/components/unsupervised-learning";

export default function UnsupervisedLearningPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clusteredImage, setClusteredImage] = useState(null);
  const [clusters, setClusters] = useState(5);
  const [clusterStats, setClusterStats] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [processingDetails, setProcessingDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageInfo, setImageInfo] = useState(null);
  const [pixelMatrix, setPixelMatrix] = useState(null);
  const [matrixView, setMatrixView] = useState("rgb"); // "rgb" or "cluster"
  const [matrixRegion, setMatrixRegion] = useState({ x: 0, y: 0, size: 20 }); // Show 20x20 region
  const [fullScreenMatrix, setFullScreenMatrix] = useState(false);
  const [fullScreenPosition, setFullScreenPosition] = useState({ x: 0, y: 0 });
  const [fullScreenZoom, setFullScreenZoom] = useState(1);
  const [fullScreenPan, setFullScreenPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const resultCanvasRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setSelectedImage(file);
        setClusteredImage(null);
        setClusterStats(null);
        setProcessingTime(null);
        setProcessingDetails(null);
        setImageInfo(null);
        setPixelMatrix(null);
        setCurrentStep("");
        setProgress(0);
        
        // Get image info
        const img = new window.Image();
        img.onload = () => {
          setImageInfo({
            width: img.width,
            height: img.height,
            pixels: img.width * img.height,
            size: (file.size / 1024).toFixed(2) + " KB"
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!imagePreview) return;

    setProcessing(true);
    setCurrentStep("Initializing...");
    setProgress(0);
    setProcessingDetails(null);
    const startTime = performance.now();
    const timings = {};

    // Create image element
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimensions
      const maxWidth = 800;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;
      const originalWidth = width;
      const originalHeight = height;

      // Scale down if too large for performance
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      setCurrentStep("Loading image to canvas...");
      setProgress(5);
      const loadStart = performance.now();
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      timings.imageLoad = (performance.now() - loadStart).toFixed(2);

      // Get image data
      setCurrentStep("Extracting image data...");
      setProgress(10);
      const extractStart = performance.now();
      const imageData = ctx.getImageData(0, 0, width, height);
      timings.dataExtraction = (performance.now() - extractStart).toFixed(2);

      // Perform K-means clustering with progress updates (async)
      setCurrentStep("Running K-means clustering...");
      const clusterStart = performance.now();
      const result = await kMeansClustering(imageData, clusters, 20, (progressUpdate) => {
        setCurrentStep(progressUpdate.step);
        setProgress(progressUpdate.progress);
      });
      timings.clustering = (performance.now() - clusterStart).toFixed(2);

      // Create result canvas
      setCurrentStep("Rendering clustered image...");
      setProgress(90);
      const renderStart = performance.now();
      
      const resultCanvas = resultCanvasRef.current;
      if (!resultCanvas) return;
      const resultCtx = resultCanvas.getContext("2d");
      if (!resultCtx) return;
      resultCanvas.width = width;
      resultCanvas.height = height;

      // Create new image data with clustered colors
      const newImageData = ctx.createImageData(width, height);
      const newData = newImageData.data;

      result.pixels.forEach((pixel) => {
        const centroid = result.centroids[pixel.cluster];
        newData[pixel.index] = centroid.r;
        newData[pixel.index + 1] = centroid.g;
        newData[pixel.index + 2] = centroid.b;
        newData[pixel.index + 3] = 255; // Alpha
      });

      resultCtx.putImageData(newImageData, 0, 0);
      timings.rendering = (performance.now() - renderStart).toFixed(2);

      // Convert to data URL
      setCurrentStep("Finalizing...");
      setProgress(95);
      const clusteredDataUrl = resultCanvas.toDataURL("image/png");
      setClusteredImage(clusteredDataUrl);
      setClusterStats(result.stats);

      // Store pixel matrix data for matrix view (optimized)
      const matrixData = [];
      // Create a map for faster pixel lookup
      const pixelMap = new Map();
      result.pixels.forEach(pixel => {
        pixelMap.set(pixel.index, pixel);
      });
      
      for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4;
          const pixel = pixelMap.get(pixelIndex);
          if (pixel) {
            const centroid = result.centroids[pixel.cluster];
            row.push({
              r: centroid.r,
              g: centroid.g,
              b: centroid.b,
              cluster: pixel.cluster,
            });
          } else {
            // Fallback: get from image data directly
            const dataIndex = pixelIndex;
            row.push({
              r: newData[dataIndex] || 0,
              g: newData[dataIndex + 1] || 0,
              b: newData[dataIndex + 2] || 0,
              cluster: 0,
            });
          }
        }
        matrixData.push(row);
      }
      setPixelMatrix({ data: matrixData, width, height });

      const endTime = performance.now();
      const totalTime = ((endTime - startTime) / 1000).toFixed(2);
      setProcessingTime(totalTime);

      // Set detailed processing information
      setProcessingDetails({
        imageDimensions: { width: originalWidth, height: originalHeight },
        processedDimensions: { width, height },
        totalPixels: width * height,
        clusters: clusters,
        iterations: result.iterations,
        converged: result.converged,
        totalInertia: result.totalInertia,
        iterationDetails: result.iterationDetails,
        timings: {
          ...timings,
          total: totalTime,
        },
      });

      setCurrentStep("Complete!");
      setProgress(100);
      setProcessing(false);
    };

    img.src = imagePreview;
  };

  const handleFullScreenClick = () => {
    if (!pixelMatrix) return;
    
    setFullScreenMatrix(true);
    setFullScreenPosition({ 
      x: Math.floor(pixelMatrix.width / 2), 
      y: Math.floor(pixelMatrix.height / 2) 
    });
    setFullScreenZoom(1);
    setFullScreenPan({ x: 0, y: 0 });
    setMatrixRegion({ 
      ...matrixRegion, 
      x: Math.max(0, Math.floor(pixelMatrix.width / 2) - Math.floor(matrixRegion.size / 2)),
      y: Math.max(0, Math.floor(pixelMatrix.height / 2) - Math.floor(matrixRegion.size / 2))
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-black dark:bg-[#1a1a1a] dark:text-white">
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <section className="mb-12 border-b-4 border-slate-700 dark:border-slate-600 pb-8">
          <div className="inline-flex items-center gap-2 border-4 border-purple-600 dark:border-purple-500 bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider mb-4">
            🤖 Unsupervised Learning
          </div>
          <h1 className="text-5xl font-bold uppercase tracking-tight mb-4">
            K-Means Clustering
          </h1>
          <p className="text-lg font-medium leading-relaxed max-w-3xl">
            Upload an image to see real-time unsupervised learning in action.
            K-means clustering groups similar pixels together, revealing the
            dominant colors and patterns in your image.
          </p>
        </section>

        <ImageUploadControls
          fileInputRef={fileInputRef}
          imagePreview={imagePreview}
          clusters={clusters}
          setClusters={setClusters}
          onImageSelect={handleImageSelect}
          onProcessImage={processImage}
          processing={processing}
        />

        <ProcessingProgress
          processing={processing}
          currentStep={currentStep}
          progress={progress}
        />

        <ImageInfo imageInfo={imageInfo} clusters={clusters} />

        <ImageDisplay
          imagePreview={imagePreview}
          clusteredImage={clusteredImage}
          processingTime={processingTime}
        />

        <ProcessingDetails processingDetails={processingDetails} />

        <ClusterStatistics clusterStats={clusterStats} />

        <ColorDecompositionMatrix clusterStats={clusterStats} />

        <div className="w-full -mx-6 px-6">
          <ImageMatrixView
            pixelMatrix={pixelMatrix}
            matrixView={matrixView}
            setMatrixView={setMatrixView}
            matrixRegion={matrixRegion}
            setMatrixRegion={setMatrixRegion}
            onFullScreenClick={handleFullScreenClick}
          />
        </div>

        <FullScreenMatrixPreview
          fullScreenMatrix={fullScreenMatrix}
          setFullScreenMatrix={setFullScreenMatrix}
          clusteredImage={clusteredImage}
          pixelMatrix={pixelMatrix}
          matrixView={matrixView}
          setMatrixView={setMatrixView}
          matrixRegion={matrixRegion}
          setMatrixRegion={setMatrixRegion}
          fullScreenPosition={fullScreenPosition}
          setFullScreenPosition={setFullScreenPosition}
          fullScreenZoom={fullScreenZoom}
          setFullScreenZoom={setFullScreenZoom}
          fullScreenPan={fullScreenPan}
          setFullScreenPan={setFullScreenPan}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dragStart={dragStart}
          setDragStart={setDragStart}
        />

        <InformationSection />

        {/* Hidden canvases for processing */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={resultCanvasRef} className="hidden" />
      </main>
    </div>
  );
}
