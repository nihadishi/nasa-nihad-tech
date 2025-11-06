// Helper function to yield control to browser
export const yieldToBrowser = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// K-means clustering implementation with detailed tracking (async)
export const kMeansClustering = async (imageData, k, maxIterations = 10, onProgress) => {
  const pixels = [];
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const BATCH_SIZE = 1000; // Process pixels in batches

  // Extract pixel data (RGB values)
  onProgress?.({ step: "Extracting pixel data...", progress: 10 });
  for (let i = 0; i < data.length; i += 4) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      index: i,
      cluster: -1,
    });
  }
  await yieldToBrowser();

  // Initialize centroids randomly
  onProgress?.({ step: "Initializing cluster centroids...", progress: 20 });
  const centroids = [];
  const usedIndices = new Set();
  for (let i = 0; i < k; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * pixels.length);
    } while (usedIndices.has(randomIndex));
    usedIndices.add(randomIndex);
    
    const randomPixel = pixels[randomIndex];
    centroids.push({
      r: randomPixel.r,
      g: randomPixel.g,
      b: randomPixel.b,
      cluster: i,
      initialR: randomPixel.r,
      initialG: randomPixel.g,
      initialB: randomPixel.b,
    });
  }
  await yieldToBrowser();

  // K-means iteration
  let iterations = 0;
  let changed = true;
  const iterationDetails = [];
  let totalInertia = 0;

  while (iterations < maxIterations && changed) {
    const iterationStart = performance.now();
    changed = false;
    let pixelsChanged = 0;

    // Assign pixels to nearest centroid (in batches)
    onProgress?.({ 
      step: `Iteration ${iterations + 1}: Assigning pixels to clusters...`, 
      progress: 30 + (iterations * 4) 
    });

    for (let i = 0; i < pixels.length; i += BATCH_SIZE) {
      const batch = pixels.slice(i, Math.min(i + BATCH_SIZE, pixels.length));
      
      batch.forEach((pixel) => {
        let minDistance = Infinity;
        let nearestCluster = 0;

        centroids.forEach((centroid, cIdx) => {
          const distance =
            Math.pow(pixel.r - centroid.r, 2) +
            Math.pow(pixel.g - centroid.g, 2) +
            Math.pow(pixel.b - centroid.b, 2);

          if (distance < minDistance) {
            minDistance = distance;
            nearestCluster = cIdx;
          }
        });

        if (pixel.cluster !== nearestCluster) {
          changed = true;
          pixelsChanged++;
          pixel.cluster = nearestCluster;
        }
        pixel.distance = minDistance;
      });

      // Update progress and yield every few batches for better responsiveness
      if (i % (BATCH_SIZE * 5) === 0 || i === pixels.length - 1) {
        const batchProgress = 30 + (iterations * 4) + Math.floor((i / pixels.length) * 3);
        onProgress?.({ 
          step: `Iteration ${iterations + 1}: Assigning pixels to clusters... (${Math.floor((i / pixels.length) * 100)}%)`, 
          progress: batchProgress 
        });
        await yieldToBrowser();
      }
    }

    // Update centroids
    onProgress?.({ 
      step: `Iteration ${iterations + 1}: Updating centroids...`, 
      progress: 33 + (iterations * 4) 
    });
    await yieldToBrowser();

    const clusterSums = Array(k)
      .fill(0)
      .map(() => ({ r: 0, g: 0, b: 0, count: 0, distances: [] }));

    // Process pixels in batches for centroid update
    for (let i = 0; i < pixels.length; i += BATCH_SIZE) {
      const batch = pixels.slice(i, Math.min(i + BATCH_SIZE, pixels.length));
      
      batch.forEach((pixel) => {
        const cluster = clusterSums[pixel.cluster];
        cluster.r += pixel.r;
        cluster.g += pixel.g;
        cluster.b += pixel.b;
        cluster.count++;
        cluster.distances.push(pixel.distance);
      });

      if (i % (BATCH_SIZE * 5) === 0 || i === pixels.length - 1) {
        await yieldToBrowser();
      }
    }

    let centroidsMoved = 0;
    centroids.forEach((centroid, idx) => {
      const cluster = clusterSums[idx];
      if (cluster.count > 0) {
        const newR = Math.round(cluster.r / cluster.count);
        const newG = Math.round(cluster.g / cluster.count);
        const newB = Math.round(cluster.b / cluster.count);

        if (
          newR !== centroid.r ||
          newG !== centroid.g ||
          newB !== centroid.b
        ) {
          changed = true;
          centroidsMoved++;
        }

        centroid.r = newR;
        centroid.g = newG;
        centroid.b = newB;
      }
    });

    // Calculate inertia for this iteration
    const iterationInertia = pixels.reduce((sum, pixel) => sum + pixel.distance, 0);
    totalInertia = iterationInertia;

    const iterationTime = performance.now() - iterationStart;
    iterationDetails.push({
      iteration: iterations + 1,
      pixelsChanged,
      centroidsMoved,
      inertia: iterationInertia.toFixed(2),
      time: iterationTime.toFixed(2),
      converged: !changed,
    });

    onProgress?.({ 
      step: `Iteration ${iterations + 1} complete${changed ? '' : ' (converged)'}...`, 
      progress: 37 + (iterations * 4) 
    });
    await yieldToBrowser();

    iterations++;
  }

  // Calculate cluster statistics with more details (optimized)
  onProgress?.({ step: "Calculating cluster statistics...", progress: 90 });
  await yieldToBrowser();

  // Pre-calculate cluster statistics in a single pass (memory efficient)
  const clusterStats = Array(k).fill(0).map(() => ({
    count: 0,
    sumDistance: 0,
    maxDistance: 0,
  }));

  // Process pixels in batches for statistics
  const STATS_BATCH_SIZE = 5000;
  for (let i = 0; i < pixels.length; i += STATS_BATCH_SIZE) {
    const batch = pixels.slice(i, Math.min(i + STATS_BATCH_SIZE, pixels.length));
    
    batch.forEach((pixel) => {
      const cluster = clusterStats[pixel.cluster];
      cluster.count++;
      cluster.sumDistance += pixel.distance;
      if (pixel.distance > cluster.maxDistance) {
        cluster.maxDistance = pixel.distance;
      }
    });

    // Yield periodically for better UI responsiveness
    if (i % (STATS_BATCH_SIZE * 2) === 0 || i === pixels.length - 1) {
      const statsProgress = 90 + Math.floor((i / pixels.length) * 5);
      onProgress?.({ 
        step: `Calculating cluster statistics... (${Math.floor((i / pixels.length) * 100)}%)`, 
        progress: Math.min(statsProgress, 95)
      });
      await yieldToBrowser();
    }
  }

  // Calculate final statistics (now much faster since we pre-calculated)
  onProgress?.({ step: "Finalizing statistics...", progress: 95 });
  await yieldToBrowser();

  const stats = centroids.map((centroid, idx) => {
    const cluster = clusterStats[idx];
    const avgDistance = cluster.count > 0 
      ? (cluster.sumDistance / cluster.count).toFixed(2)
      : 0;
    const maxDistance = cluster.maxDistance.toFixed(2);

    return {
      cluster: idx,
      color: `rgb(${centroid.r}, ${centroid.g}, ${centroid.b})`,
      count: cluster.count,
      percentage: ((cluster.count / pixels.length) * 100).toFixed(2),
      centroid: { r: centroid.r, g: centroid.g, b: centroid.b },
      initialCentroid: { 
        r: centroid.initialR, 
        g: centroid.initialG, 
        b: centroid.initialB 
      },
      avgDistance,
      maxDistance,
    };
  });

  return { 
    pixels, 
    centroids, 
    stats, 
    iterations, 
    converged: !changed,
    totalInertia: totalInertia.toFixed(2),
    iterationDetails,
  };
};

