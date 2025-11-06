"use client";

import { useRef, useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function ImageMatrixView({ 
  pixelMatrix, 
  originalImageData,
  matrixView, 
  setMatrixView, 
  matrixRegion, 
  setMatrixRegion,
  onFullScreenClick 
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ 
          width: rect.width - 32, // Account for padding (16px each side)
          height: rect.height - 32 // Account for padding (16px each side)
        });
      }
    };

    // Initial size calculation
    updateSize();
    
    // Recalculate when region size changes
    const timeoutId = setTimeout(updateSize, 0);
    
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timeoutId);
    };
  }, [matrixRegion.size, matrixView]);

  if (!pixelMatrix) return null;

  const exportToExcel = () => {
    if (!originalImageData) {
      alert("Original image data not available. Please process the image first.");
      return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create RGB data sheet
    const rgbData = [];
    
    // Add header row
    const headerRow = ['Y\\X'];
    for (let x = 0; x < originalImageData.width; x++) {
      headerRow.push(`X${x}`);
    }
    rgbData.push(headerRow);

    // Add data rows with RGB values
    for (let y = 0; y < originalImageData.height; y++) {
      const row = [`Y${y}`];
      for (let x = 0; x < originalImageData.width; x++) {
        const pixel = originalImageData.data[y][x];
        row.push(`R:${pixel.r} G:${pixel.g} B:${pixel.b}`);
      }
      rgbData.push(row);
    }

    // Create separate sheets for R, G, B values
    const rData = [['Y\\X', ...Array.from({ length: originalImageData.width }, (_, i) => `X${i}`)]];
    const gData = [['Y\\X', ...Array.from({ length: originalImageData.width }, (_, i) => `X${i}`)]];
    const bData = [['Y\\X', ...Array.from({ length: originalImageData.width }, (_, i) => `X${i}`)]];

    for (let y = 0; y < originalImageData.height; y++) {
      const rRow = [`Y${y}`];
      const gRow = [`Y${y}`];
      const bRow = [`Y${y}`];
      
      for (let x = 0; x < originalImageData.width; x++) {
        const pixel = originalImageData.data[y][x];
        rRow.push(pixel.r);
        gRow.push(pixel.g);
        bRow.push(pixel.b);
      }
      
      rData.push(rRow);
      gData.push(gRow);
      bData.push(bRow);
    }

    // Create worksheets
    const wsRGB = XLSX.utils.aoa_to_sheet(rgbData);
    const wsR = XLSX.utils.aoa_to_sheet(rData);
    const wsG = XLSX.utils.aoa_to_sheet(gData);
    const wsB = XLSX.utils.aoa_to_sheet(bData);

    // Set column widths for better readability
    const setColumnWidths = (ws, width) => {
      const colWidths = [{ wch: 8 }]; // First column for Y coordinates
      for (let i = 0; i < originalImageData.width; i++) {
        colWidths.push({ wch: width });
      }
      ws['!cols'] = colWidths;
    };

    setColumnWidths(wsRGB, 15);
    setColumnWidths(wsR, 6);
    setColumnWidths(wsG, 6);
    setColumnWidths(wsB, 6);

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, wsRGB, "RGB Combined");
    XLSX.utils.book_append_sheet(wb, wsR, "Red Channel");
    XLSX.utils.book_append_sheet(wb, wsG, "Green Channel");
    XLSX.utils.book_append_sheet(wb, wsB, "Blue Channel");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `image-rgb-export-${timestamp}.xlsx`;

    // Write and download
    XLSX.writeFile(wb, filename);
  };

  return (
    <section className="mb-12 w-full">
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold uppercase tracking-wider">
            Image as Numerical Matrix
          </h2>
          <div className="flex gap-3">
            {originalImageData && (
              <button
                onClick={exportToExcel}
                className="px-6 py-3 text-sm font-bold uppercase border-4 border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white hover:shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
              >
                📊 Export to Excel
              </button>
            )}
            <button
              onClick={onFullScreenClick}
              className="px-6 py-3 text-sm font-bold uppercase border-4 border-purple-600 dark:border-purple-500 bg-purple-600 dark:bg-purple-500 text-white hover:shadow-[8px_8px_0px_0px_rgba(147,51,234,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
            >
              🔍 Full Screen Preview
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMatrixView("rgb")}
                  className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all ${
                    matrixView === "rgb"
                      ? "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black hover:border-slate-500 dark:hover:border-slate-500"
                  }`}
                >
                  RGB Values
                </button>
                <button
                  onClick={() => setMatrixView("cluster")}
                  className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all ${
                    matrixView === "cluster"
                      ? "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black hover:border-slate-500 dark:hover:border-slate-500"
                  }`}
                >
                  Cluster Numbers
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Region Size
              </label>
              <input
                type="range"
                min="2"
                max="200"
                value={matrixRegion.size}
                onChange={(e) => setMatrixRegion({ ...matrixRegion, size: parseInt(e.target.value) })}
                className="w-32"
              />
              <span className="ml-2 text-sm font-mono">{matrixRegion.size}×{matrixRegion.size}</span>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                X Position
              </label>
              <input
                type="range"
                min="0"
                max={pixelMatrix ? Math.max(0, pixelMatrix.width - matrixRegion.size) : 0}
                value={matrixRegion.x}
                onChange={(e) => setMatrixRegion({ ...matrixRegion, x: parseInt(e.target.value) })}
                className="w-32"
              />
              <span className="ml-2 text-sm font-mono">{matrixRegion.x}</span>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Y Position
              </label>
              <input
                type="range"
                min="0"
                max={pixelMatrix ? Math.max(0, pixelMatrix.height - matrixRegion.size) : 0}
                value={matrixRegion.y}
                onChange={(e) => setMatrixRegion({ ...matrixRegion, y: parseInt(e.target.value) })}
                className="w-32"
              />
              <span className="ml-2 text-sm font-mono">{matrixRegion.y}</span>
            </div>
          </div>

          <div className="text-xs text-black/60 dark:text-white/60">
            Showing region: ({matrixRegion.x}, {matrixRegion.y}) to ({matrixRegion.x + matrixRegion.size - 1}, {matrixRegion.y + matrixRegion.size - 1}) 
            of {pixelMatrix ? `${pixelMatrix.width}×${pixelMatrix.height}` : '0×0'} image
          </div>
        </div>

        {/* Matrix Display */}
        <div 
          ref={containerRef}
          className="overflow-auto max-h-[1200px] border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4"
        >
          <div className="inline-block">
            {(() => {
              // Calculate dynamic sizing based on available container space
              const calculateCellSize = (regionSize, containerWidth, containerHeight, isRgbView) => {
                // Reserve space for row/column headers (approximately 40px for header column)
                const headerWidth = 40;
                const availableWidth = Math.max(containerWidth - headerWidth, 200);
                const availableHeight = Math.max(containerHeight, 200);
                
                // Calculate maximum cell size that fits
                // For RGB view, cells need more space (3 lines of text)
                // For cluster view, cells need less space (single number)
                const cellAspectRatio = isRgbView ? 1.5 : 1; // RGB cells are taller
                
                const maxCellWidth = Math.floor(availableWidth / (regionSize + 1)); // +1 for header column
                const maxCellHeight = Math.floor(availableHeight / (regionSize + 1)); // +1 for header row
                
                // Use the smaller dimension to ensure it fits both ways
                let cellSize = Math.min(maxCellWidth, maxCellHeight / cellAspectRatio);
                
                // Ensure minimum readable size
                const minCellSize = isRgbView ? 8 : 6;
                const maxCellSize = isRgbView ? 50 : 40;
                cellSize = Math.max(minCellSize, Math.min(cellSize, maxCellSize));
                
                // Calculate font size based on cell size
                // For RGB: need space for 3 numbers, so font should be ~30% of cell height
                // For cluster: need space for 1-2 digit number, so font can be ~60% of cell height
                const fontSize = isRgbView 
                  ? Math.max(4, Math.floor(cellSize * 0.25))
                  : Math.max(6, Math.floor(cellSize * 0.5));
                
                const headerFontSize = Math.max(6, Math.floor(fontSize * 0.8));
                const rgbValueFontSize = Math.max(3, Math.floor(fontSize * 0.7));
                
                // Calculate padding (smaller for larger matrices)
                const padding = cellSize < 12 ? 0 : cellSize < 20 ? 1 : 2;
                
                return {
                  cellWidth: `${cellSize}px`,
                  cellHeight: `${Math.floor(cellSize * cellAspectRatio)}px`,
                  fontSize: `${fontSize}px`,
                  headerFontSize: `${headerFontSize}px`,
                  rgbValueFontSize: `${rgbValueFontSize}px`,
                  padding: `${padding}px`,
                };
              };

              const cellStyle = calculateCellSize(
                matrixRegion.size, 
                containerSize.width || 800, 
                containerSize.height || 600,
                matrixView === "rgb"
              );

              return matrixView === "rgb" ? (
                // RGB Matrix View
                <table className="border-collapse font-mono" style={{ fontSize: cellStyle.fontSize }}>
                  <thead>
                    <tr>
                      <th 
                        className="border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold text-center"
                        style={{ 
                          padding: cellStyle.padding,
                          fontSize: cellStyle.headerFontSize,
                          minWidth: cellStyle.cellWidth,
                          width: cellStyle.cellWidth
                        }}
                      ></th>
                      {Array.from({ length: matrixRegion.size }, (_, i) => {
                        const x = matrixRegion.x + i;
                        if (x >= pixelMatrix.width) return null;
                        return (
                          <th 
                            key={i} 
                            className="border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold text-center"
                            style={{ 
                              padding: cellStyle.padding,
                              fontSize: cellStyle.headerFontSize,
                              minWidth: cellStyle.cellWidth,
                              width: cellStyle.cellWidth
                            }}
                          >
                            {x}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: matrixRegion.size }, (_, rowIdx) => {
                      const y = matrixRegion.y + rowIdx;
                      if (y >= pixelMatrix.height) return null;
                      return (
                        <tr key={rowIdx}>
                          <td 
                            className="border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold text-right"
                            style={{ 
                              padding: cellStyle.padding,
                              fontSize: cellStyle.headerFontSize,
                              minWidth: cellStyle.cellWidth,
                              width: cellStyle.cellWidth
                            }}
                          >
                            {y}
                          </td>
                          {Array.from({ length: matrixRegion.size }, (_, colIdx) => {
                            const x = matrixRegion.x + colIdx;
                            if (x >= pixelMatrix.width) return null;
                            const pixel = pixelMatrix.data[y]?.[x];
                            if (!pixel) return (
                              <td 
                                key={colIdx} 
                                className="border border-slate-300 dark:border-slate-700"
                                style={{ 
                                  padding: cellStyle.padding,
                                  minWidth: cellStyle.cellWidth,
                                  width: cellStyle.cellWidth,
                                  height: cellStyle.cellHeight
                                }}
                              ></td>
                            );
                            
                            return (
                              <td
                                key={colIdx}
                                className="border border-slate-300 dark:border-slate-700 text-center"
                                style={{ 
                                  backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                                  padding: cellStyle.padding,
                                  minWidth: cellStyle.cellWidth,
                                  width: cellStyle.cellWidth,
                                  height: cellStyle.cellHeight,
                                  fontSize: cellStyle.rgbValueFontSize,
                                  lineHeight: '1'
                                }}
                                title={`RGB(${pixel.r}, ${pixel.g}, ${pixel.b})`}
                              >
                                <div className="font-bold leading-none">
                                  <div className="text-red-600 dark:text-red-400">{pixel.r}</div>
                                  <div className="text-green-600 dark:text-green-400">{pixel.g}</div>
                                  <div className="text-blue-600 dark:text-blue-400">{pixel.b}</div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                // Cluster Number Matrix View
                <table className="border-collapse font-mono" style={{ fontSize: cellStyle.fontSize }}>
                  <thead>
                    <tr>
                      <th 
                        className="border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold text-center"
                        style={{ 
                          padding: cellStyle.padding,
                          fontSize: cellStyle.headerFontSize,
                          minWidth: cellStyle.cellWidth,
                          width: cellStyle.cellWidth
                        }}
                      ></th>
                      {Array.from({ length: matrixRegion.size }, (_, i) => {
                        const x = matrixRegion.x + i;
                        if (x >= pixelMatrix.width) return null;
                        return (
                          <th 
                            key={i} 
                            className="border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold text-center"
                            style={{ 
                              padding: cellStyle.padding,
                              fontSize: cellStyle.headerFontSize,
                              minWidth: cellStyle.cellWidth,
                              width: cellStyle.cellWidth
                            }}
                          >
                            {x}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: matrixRegion.size }, (_, rowIdx) => {
                      const y = matrixRegion.y + rowIdx;
                      if (y >= pixelMatrix.height) return null;
                      return (
                        <tr key={rowIdx}>
                          <td 
                            className="border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold text-right"
                            style={{ 
                              padding: cellStyle.padding,
                              fontSize: cellStyle.headerFontSize,
                              minWidth: cellStyle.cellWidth,
                              width: cellStyle.cellWidth
                            }}
                          >
                            {y}
                          </td>
                          {Array.from({ length: matrixRegion.size }, (_, colIdx) => {
                            const x = matrixRegion.x + colIdx;
                            if (x >= pixelMatrix.width) return null;
                            const pixel = pixelMatrix.data[y]?.[x];
                            if (!pixel) return (
                              <td 
                                key={colIdx} 
                                className="border border-slate-300 dark:border-slate-700"
                                style={{ 
                                  padding: cellStyle.padding,
                                  minWidth: cellStyle.cellWidth,
                                  width: cellStyle.cellWidth,
                                  height: cellStyle.cellWidth
                                }}
                              ></td>
                            );
                            
                            return (
                              <td
                                key={colIdx}
                                className="border border-slate-300 dark:border-slate-700 text-center font-bold"
                                style={{ 
                                  backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                                  padding: cellStyle.padding,
                                  minWidth: cellStyle.cellWidth,
                                  width: cellStyle.cellWidth,
                                  height: cellStyle.cellWidth,
                                  fontSize: cellStyle.fontSize,
                                  lineHeight: '1'
                                }}
                                title={`Cluster ${pixel.cluster + 1}, RGB(${pixel.r}, ${pixel.g}, ${pixel.b})`}
                              >
                                {pixel.cluster + 1}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>

        <div className="mt-4 text-xs text-black/60 dark:text-white/60 space-y-1">
          <p>
            <strong>RGB View:</strong> Shows the RGB color values (R, G, B) for each pixel in the selected region.
            Each cell is colored with its actual color and displays the numerical RGB values.
          </p>
          <p>
            <strong>Cluster View:</strong> Shows the cluster number (1 to K) assigned to each pixel.
            Each cell is colored with the cluster&apos;s representative color.
          </p>
          <p>
            <strong>Matrix Coordinates:</strong> The top row and left column show the (x, y) coordinates in the image.
            Use the sliders to navigate to different regions of the image.
          </p>
        </div>
      </div>
    </section>
  );
}

