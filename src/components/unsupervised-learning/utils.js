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

// ISODATA clustering implementation with merge/split capabilities (async)
export const isodataClustering = async (
  imageData, 
  initialK, 
  minClusters = 2,
  maxClusters = 20,
  maxIterations = 20,
  mergeThreshold = 30, // Distance threshold for merging clusters
  splitThreshold = 50, // Standard deviation threshold for splitting
  minClusterSize = 50, // Minimum pixels per cluster
  onProgress
) => {
  const pixels = [];
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const BATCH_SIZE = 1000;

  // Extract pixel data (RGB values)
  onProgress?.({ step: "Extracting pixel data...", progress: 5 });
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
  onProgress?.({ step: "Initializing cluster centroids...", progress: 10 });
  let centroids = [];
  const usedIndices = new Set();
  for (let i = 0; i < initialK; i++) {
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

  let iterations = 0;
  const iterationDetails = [];
  let totalInertia = 0;

  while (iterations < maxIterations && centroids.length >= minClusters && centroids.length <= maxClusters) {
    const iterationStart = performance.now();
    let changed = false;
    let pixelsChanged = 0;

    // Assign pixels to nearest centroid
    onProgress?.({ 
      step: `Iteration ${iterations + 1}: Assigning pixels to clusters (${centroids.length} clusters)...`, 
      progress: 15 + (iterations * 3) 
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

      if (i % (BATCH_SIZE * 5) === 0 || i === pixels.length - 1) {
        await yieldToBrowser();
      }
    }

    // Update centroids
    onProgress?.({ 
      step: `Iteration ${iterations + 1}: Updating centroids...`, 
      progress: 18 + (iterations * 3) 
    });
    await yieldToBrowser();

    const clusterSums = Array(centroids.length)
      .fill(0)
      .map(() => ({ r: 0, g: 0, b: 0, count: 0, pixels: [] }));

    for (let i = 0; i < pixels.length; i += BATCH_SIZE) {
      const batch = pixels.slice(i, Math.min(i + BATCH_SIZE, pixels.length));
      
      batch.forEach((pixel) => {
        const cluster = clusterSums[pixel.cluster];
        cluster.r += pixel.r;
        cluster.g += pixel.g;
        cluster.b += pixel.b;
        cluster.count++;
        cluster.pixels.push(pixel);
      });

      if (i % (BATCH_SIZE * 5) === 0 || i === pixels.length - 1) {
        await yieldToBrowser();
      }
    }

    // Remove clusters with too few pixels
    const clustersToRemove = [];
    clusterSums.forEach((cluster, idx) => {
      if (cluster.count < minClusterSize && centroids.length > minClusters) {
        clustersToRemove.push(idx);
      }
    });

    if (clustersToRemove.length > 0) {
      onProgress?.({ 
        step: `Iteration ${iterations + 1}: Removing ${clustersToRemove.length} small cluster(s)...`, 
        progress: 20 + (iterations * 3) 
      });
      
      // Remove clusters in reverse order to maintain indices
      clustersToRemove.reverse().forEach(idx => {
        centroids.splice(idx, 1);
        clusterSums.splice(idx, 1);
        // Reassign pixels from removed clusters
        pixels.forEach(pixel => {
          if (pixel.cluster === idx) {
            pixel.cluster = -1; // Mark for reassignment
          } else if (pixel.cluster > idx) {
            pixel.cluster--; // Adjust cluster indices
          }
        });
      });
      
      // Reassign orphaned pixels
      pixels.forEach(pixel => {
        if (pixel.cluster === -1) {
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
          pixel.cluster = nearestCluster;
          pixel.distance = minDistance;
        }
      });
      
      // Recalculate cluster sums after removal
      clusterSums.forEach(cluster => {
        cluster.r = 0;
        cluster.g = 0;
        cluster.b = 0;
        cluster.count = 0;
        cluster.pixels = [];
      });
      
      pixels.forEach(pixel => {
        const cluster = clusterSums[pixel.cluster];
        cluster.r += pixel.r;
        cluster.g += pixel.g;
        cluster.b += pixel.b;
        cluster.count++;
        cluster.pixels.push(pixel);
      });
      
      await yieldToBrowser();
    }

    // Update centroids
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

    // Calculate standard deviations for each cluster
    const clusterStdDevs = centroids.map((centroid, idx) => {
      const cluster = clusterSums[idx];
      if (cluster.count === 0) return { r: 0, g: 0, b: 0, max: 0 };
      
      let sumR2 = 0, sumG2 = 0, sumB2 = 0;
      cluster.pixels.forEach(pixel => {
        sumR2 += Math.pow(pixel.r - centroid.r, 2);
        sumG2 += Math.pow(pixel.g - centroid.g, 2);
        sumB2 += Math.pow(pixel.b - centroid.b, 2);
      });
      
      const stdR = Math.sqrt(sumR2 / cluster.count);
      const stdG = Math.sqrt(sumG2 / cluster.count);
      const stdB = Math.sqrt(sumB2 / cluster.count);
      const maxStd = Math.max(stdR, stdG, stdB);
      
      return { r: stdR, g: stdG, b: stdB, max: maxStd };
    });

    // Split clusters with high standard deviation (if under max clusters)
    if (centroids.length < maxClusters && iterations % 2 === 0 && iterations > 0) {
      const clustersToSplit = [];
      clusterStdDevs.forEach((stdDev, idx) => {
        if (stdDev.max > splitThreshold && clusterSums[idx].count > minClusterSize * 2) {
          clustersToSplit.push(idx);
        }
      });

      if (clustersToSplit.length > 0 && centroids.length + clustersToSplit.length <= maxClusters) {
        onProgress?.({ 
          step: `Iteration ${iterations + 1}: Splitting ${clustersToSplit.length} cluster(s)...`, 
          progress: 22 + (iterations * 3) 
        });
        
        clustersToSplit.reverse().forEach(idx => {
          const centroid = centroids[idx];
          const cluster = clusterSums[idx];
          const stdDev = clusterStdDevs[idx];
          
          // Create two new centroids by offsetting along the dimension with max std dev
          const offset = stdDev.max * 0.5;
          const newCentroid1 = {
            r: Math.max(0, Math.min(255, Math.round(centroid.r - (stdDev.r > stdDev.g && stdDev.r > stdDev.b ? offset : 0)))),
            g: Math.max(0, Math.min(255, Math.round(centroid.g - (stdDev.g > stdDev.r && stdDev.g > stdDev.b ? offset : 0)))),
            b: Math.max(0, Math.min(255, Math.round(centroid.b - (stdDev.b > stdDev.r && stdDev.b > stdDev.g ? offset : 0)))),
            cluster: centroids.length,
            initialR: centroid.r,
            initialG: centroid.g,
            initialB: centroid.b,
          };
          
          const newCentroid2 = {
            r: Math.max(0, Math.min(255, Math.round(centroid.r + (stdDev.r > stdDev.g && stdDev.r > stdDev.b ? offset : 0)))),
            g: Math.max(0, Math.min(255, Math.round(centroid.g + (stdDev.g > stdDev.r && stdDev.g > stdDev.b ? offset : 0)))),
            b: Math.max(0, Math.min(255, Math.round(centroid.b + (stdDev.b > stdDev.r && stdDev.b > stdDev.g ? offset : 0)))),
            cluster: centroids.length + 1,
            initialR: centroid.r,
            initialG: centroid.g,
            initialB: centroid.b,
          };
          
          // Replace old centroid with first new one, add second
          centroids[idx] = newCentroid1;
          centroids.push(newCentroid2);
          
          // Reassign pixels from split cluster
          cluster.pixels.forEach(pixel => {
            const dist1 = Math.pow(pixel.r - newCentroid1.r, 2) + 
                         Math.pow(pixel.g - newCentroid1.g, 2) + 
                         Math.pow(pixel.b - newCentroid1.b, 2);
            const dist2 = Math.pow(pixel.r - newCentroid2.r, 2) + 
                         Math.pow(pixel.g - newCentroid2.g, 2) + 
                         Math.pow(pixel.b - newCentroid2.b, 2);
            pixel.cluster = dist1 < dist2 ? idx : centroids.length - 1;
            pixel.distance = Math.min(dist1, dist2);
          });
        });
        
        await yieldToBrowser();
      }
    }

    // Merge clusters that are too close (if over min clusters)
    if (centroids.length > minClusters && iterations % 2 === 1 && iterations > 1) {
      const mergePairs = [];
      for (let i = 0; i < centroids.length; i++) {
        for (let j = i + 1; j < centroids.length; j++) {
          const distance = Math.sqrt(
            Math.pow(centroids[i].r - centroids[j].r, 2) +
            Math.pow(centroids[i].g - centroids[j].g, 2) +
            Math.pow(centroids[i].b - centroids[j].b, 2)
          );
          if (distance < mergeThreshold) {
            mergePairs.push({ i, j, distance });
          }
        }
      }

      if (mergePairs.length > 0 && centroids.length - mergePairs.length >= minClusters) {
        onProgress?.({ 
          step: `Iteration ${iterations + 1}: Merging ${mergePairs.length} cluster pair(s)...`, 
          progress: 24 + (iterations * 3) 
        });
        
        // Sort by distance and merge closest pairs first
        mergePairs.sort((a, b) => a.distance - b.distance);
        const merged = new Set();
        const mergeMap = new Map(); // Maps cluster index to the cluster it was merged into
        
        mergePairs.forEach(pair => {
          // Skip if either cluster is already merged
          if (merged.has(pair.i) || merged.has(pair.j)) {
            return;
          }
          
          const cluster1 = clusterSums[pair.i];
          const cluster2 = clusterSums[pair.j];
          const totalCount = cluster1.count + cluster2.count;
          
          if (totalCount > 0) {
            // Merge into cluster i (keep the smaller index)
            const newR = Math.round((cluster1.r + cluster2.r) / totalCount);
            const newG = Math.round((cluster1.g + cluster2.g) / totalCount);
            const newB = Math.round((cluster1.b + cluster2.b) / totalCount);
            
            centroids[pair.i].r = newR;
            centroids[pair.i].g = newG;
            centroids[pair.i].b = newB;
            
            // Track that j was merged into i
            mergeMap.set(pair.j, pair.i);
            merged.add(pair.i);
            merged.add(pair.j);
          }
        });
        
        // Remove merged clusters in reverse order to maintain indices
        const sortedToRemove = Array.from(mergeMap.keys()).sort((a, b) => b - a);
        sortedToRemove.forEach(j => {
          const mergeInto = mergeMap.get(j);
          const cluster1 = clusterSums[mergeInto];
          const cluster2 = clusterSums[j];
          const totalCount = cluster1.count + cluster2.count;
          const newR = Math.round((cluster1.r + cluster2.r) / totalCount);
          const newG = Math.round((cluster1.g + cluster2.g) / totalCount);
          const newB = Math.round((cluster1.b + cluster2.b) / totalCount);
          
          // Reassign pixels from cluster j to the cluster it was merged into
          pixels.forEach(pixel => {
            if (pixel.cluster === j) {
              pixel.cluster = mergeInto;
              pixel.distance = Math.pow(pixel.r - newR, 2) + 
                              Math.pow(pixel.g - newG, 2) + 
                              Math.pow(pixel.b - newB, 2);
            } else if (pixel.cluster > j) {
              pixel.cluster--; // Adjust indices
            }
          });
          
          // Remove cluster j
          centroids.splice(j, 1);
          clusterSums.splice(j, 1);
        });
        
        // Recalculate cluster indices
        centroids.forEach((centroid, idx) => {
          centroid.cluster = idx;
        });
        
        await yieldToBrowser();
      }
    }

    // Calculate inertia
    const iterationInertia = pixels.reduce((sum, pixel) => sum + pixel.distance, 0);
    totalInertia = iterationInertia;

    const iterationTime = performance.now() - iterationStart;
    iterationDetails.push({
      iteration: iterations + 1,
      pixelsChanged,
      centroidsMoved,
      clustersCount: centroids.length,
      inertia: iterationInertia.toFixed(2),
      time: iterationTime.toFixed(2),
      converged: !changed && centroids.length >= minClusters && centroids.length <= maxClusters,
    });

    onProgress?.({ 
      step: `Iteration ${iterations + 1} complete (${centroids.length} clusters)${!changed ? ' (converged)' : ''}...`, 
      progress: 25 + (iterations * 3) 
    });
    await yieldToBrowser();

    if (!changed && centroids.length >= minClusters && centroids.length <= maxClusters) {
      break; // Converged
    }

    iterations++;
  }

  // Calculate cluster statistics
  onProgress?.({ step: "Calculating cluster statistics...", progress: 85 });
  await yieldToBrowser();

  const clusterStats = Array(centroids.length).fill(0).map(() => ({
    count: 0,
    sumDistance: 0,
    maxDistance: 0,
  }));

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

    if (i % (STATS_BATCH_SIZE * 2) === 0 || i === pixels.length - 1) {
      await yieldToBrowser();
    }
  }

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
    converged: centroids.length >= minClusters && centroids.length <= maxClusters,
    totalInertia: totalInertia.toFixed(2),
    iterationDetails,
    finalClusterCount: centroids.length,
  };
};

