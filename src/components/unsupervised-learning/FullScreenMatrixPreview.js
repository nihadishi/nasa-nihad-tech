"use client";

import { useRef } from "react";

export default function FullScreenMatrixPreview({
  fullScreenMatrix,
  setFullScreenMatrix,
  clusteredImage,
  pixelMatrix,
  matrixView,
  setMatrixView,
  matrixRegion,
  setMatrixRegion,
  fullScreenPosition,
  setFullScreenPosition,
  fullScreenZoom,
  setFullScreenZoom,
  fullScreenPan,
  setFullScreenPan,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
}) {
  const fullScreenRef = useRef(null);

  if (!fullScreenMatrix || !clusteredImage || !pixelMatrix) return null;

  const handleMouseDown = (e) => {
    if (e.button === 0 && e.target.closest('.image-container')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - fullScreenPan.x, y: e.clientY - fullScreenPan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!pixelMatrix) return;
    
    if (isDragging) {
      setFullScreenPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      // Update matrix position based on mouse
      const imageContainer = fullScreenRef.current?.querySelector('.image-container');
      if (!imageContainer) return;
      
      const rect = imageContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate pixel position accounting for zoom and pan
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const pixelX = Math.floor(((mouseX - centerX - fullScreenPan.x) / fullScreenZoom) + (pixelMatrix.width / 2));
      const pixelY = Math.floor(((mouseY - centerY - fullScreenPan.y) / fullScreenZoom) + (pixelMatrix.height / 2));
      
      if (pixelX >= 0 && pixelX < pixelMatrix.width && pixelY >= 0 && pixelY < pixelMatrix.height) {
        setFullScreenPosition({ x: pixelX, y: pixelY });
        const newX = Math.max(0, Math.min(pixelX - Math.floor(matrixRegion.size / 2), pixelMatrix.width - matrixRegion.size));
        const newY = Math.max(0, Math.min(pixelY - Math.floor(matrixRegion.size / 2), pixelMatrix.height - matrixRegion.size));
        setMatrixRegion({ ...matrixRegion, x: newX, y: newY });
      }
    }
  };

  const handleWheel = (e) => {
    if (!pixelMatrix) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(5, fullScreenZoom * delta));
    
    // Zoom towards mouse position
    const imageContainer = fullScreenRef.current?.querySelector('.image-container');
    if (imageContainer) {
      const rect = imageContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const zoomChange = newZoom / fullScreenZoom;
      setFullScreenPan(prev => ({
        x: (mouseX - centerX) - (mouseX - centerX - prev.x) * zoomChange,
        y: (mouseY - centerY) - (mouseY - centerY - prev.y) * zoomChange
      }));
    }
    
    setFullScreenZoom(newZoom);
  };

  return (
    <div
      ref={fullScreenRef}
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onWheel={handleWheel}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/90 backdrop-blur-sm border-b-2 border-white/20 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setFullScreenMatrix(false)}
              className="px-4 py-2 text-sm font-bold uppercase border-2 border-red-600 bg-red-600 text-white hover:bg-red-700 transition-all"
            >
              ✕ Close
            </button>
            <div className="text-white text-sm font-mono">
              Pixel: ({fullScreenPosition.x}, {fullScreenPosition.y}) | 
              Zoom: {(fullScreenZoom * 100).toFixed(0)}% | 
              Matrix: {matrixRegion.size}×{matrixRegion.size}
            </div>
            <div className="text-white/70 text-xs">
              💡 Drag to pan | Scroll to zoom | Move mouse to see RGB values
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setMatrixView("rgb")}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 ${
                matrixView === "rgb"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-white/30 text-white/70 hover:border-white/50"
              }`}
            >
              RGB
            </button>
            <button
              onClick={() => setMatrixView("cluster")}
              className={`px-3 py-1 text-xs font-bold uppercase border-2 ${
                matrixView === "cluster"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-white/30 text-white/70 hover:border-white/50"
              }`}
            >
              Cluster
            </button>
            <input
              type="range"
              min="5"
              max="30"
              value={matrixRegion.size}
              onChange={(e) => setMatrixRegion({ ...matrixRegion, size: parseInt(e.target.value) })}
              className="w-24"
            />
            <span className="text-white text-xs font-mono">{matrixRegion.size}×{matrixRegion.size}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden pt-20">
        {/* Image Display - Smaller */}
        <div className="w-80 flex items-center justify-center overflow-hidden p-4 relative image-container border-r-2 border-white/20" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
          <div
            className="relative"
            style={{
              transform: `translate(${fullScreenPan.x}px, ${fullScreenPan.y}px) scale(${fullScreenZoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clusteredImage}
              alt="Full Screen Clustered"
              className="max-w-none block"
              style={{ 
                imageRendering: 'pixelated',
                width: `${pixelMatrix.width}px`,
                height: `${pixelMatrix.height}px`,
              }}
            />
            {/* Crosshair indicator */}
            <div
              className="absolute pointer-events-none z-10"
              style={{
                left: `${fullScreenPosition.x}px`,
                top: `${fullScreenPosition.y}px`,
                transform: 'translate(-50%, -50%)',
                width: '4px',
                height: '4px',
                backgroundColor: 'yellow',
                boxShadow: '0 0 0 2px black, 0 0 6px 3px rgba(255,255,255,0.8)',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>

        {/* Matrix Panel - Larger */}
        <div className="flex-1 bg-black/95 backdrop-blur-sm p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-bold uppercase">
              Matrix View - Region around ({fullScreenPosition.x}, {fullScreenPosition.y})
            </h3>
            <div className="text-white/70 text-xs font-mono">
              {matrixRegion.size}×{matrixRegion.size} region
            </div>
          </div>
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <div className="inline-block">
              {matrixView === "rgb" ? (
                <table className="border-collapse font-mono" style={{ fontSize: matrixRegion.size > 25 ? '10px' : matrixRegion.size > 20 ? '11px' : '12px' }}>
                  <thead>
                    <tr>
                      <th className="p-1 border border-white/30 bg-white/10 text-white font-bold"></th>
                      {Array.from({ length: matrixRegion.size }, (_, i) => {
                        const x = matrixRegion.x + i;
                        if (x >= pixelMatrix.width) return null;
                        return (
                          <th key={i} className={`p-1 border border-white/30 bg-white/10 text-white font-bold text-center min-w-[60px] ${
                            x === fullScreenPosition.x ? 'bg-yellow-500/50' : ''
                          }`}>
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
                          <td className={`p-1 border border-white/30 bg-white/10 text-white font-bold text-right ${
                            y === fullScreenPosition.y ? 'bg-yellow-500/50' : ''
                          }`}>
                            {y}
                          </td>
                          {Array.from({ length: matrixRegion.size }, (_, colIdx) => {
                            const x = matrixRegion.x + colIdx;
                            if (x >= pixelMatrix.width) return null;
                            const pixel = pixelMatrix.data[y]?.[x];
                            if (!pixel) return <td key={colIdx} className="p-1 border border-white/20"></td>;
                            
                            const isCurrent = x === fullScreenPosition.x && y === fullScreenPosition.y;
                            
                            return (
                              <td
                                key={colIdx}
                                className={`p-1 border border-white/20 text-center min-w-[60px] ${isCurrent ? 'ring-2 ring-yellow-400' : ''}`}
                                style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
                                title={`RGB(${pixel.r}, ${pixel.g}, ${pixel.b})`}
                              >
                                <div className="font-bold leading-tight">
                                  <div className="text-red-300">{pixel.r}</div>
                                  <div className="text-green-300">{pixel.g}</div>
                                  <div className="text-blue-300">{pixel.b}</div>
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
                <table className="border-collapse font-mono" style={{ fontSize: matrixRegion.size > 30 ? '12px' : matrixRegion.size > 25 ? '13px' : '14px' }}>
                  <thead>
                    <tr>
                      <th className="p-1 border border-white/30 bg-white/10 text-white font-bold"></th>
                      {Array.from({ length: matrixRegion.size }, (_, i) => {
                        const x = matrixRegion.x + i;
                        if (x >= pixelMatrix.width) return null;
                        return (
                          <th key={i} className={`p-1 border border-white/30 bg-white/10 text-white font-bold text-center min-w-[40px] ${
                            x === fullScreenPosition.x ? 'bg-yellow-500/50' : ''
                          }`}>
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
                          <td className={`p-1 border border-white/30 bg-white/10 text-white font-bold text-right ${
                            y === fullScreenPosition.y ? 'bg-yellow-500/50' : ''
                          }`}>
                            {y}
                          </td>
                          {Array.from({ length: matrixRegion.size }, (_, colIdx) => {
                            const x = matrixRegion.x + colIdx;
                            if (x >= pixelMatrix.width) return null;
                            const pixel = pixelMatrix.data[y]?.[x];
                            if (!pixel) return <td key={colIdx} className="p-1 border border-white/20"></td>;
                            
                            const isCurrent = x === fullScreenPosition.x && y === fullScreenPosition.y;
                            
                            return (
                              <td
                                key={colIdx}
                                className={`p-1 border border-white/20 text-center font-bold min-w-[40px] text-lg ${isCurrent ? 'ring-2 ring-yellow-400' : ''}`}
                                style={{ 
                                  backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
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
              )}
            </div>
          </div>
          
          {/* Current Pixel Info */}
          <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded">
            <div className="text-white text-xs font-bold uppercase mb-2">Current Pixel</div>
            {pixelMatrix.data[fullScreenPosition.y]?.[fullScreenPosition.x] && (() => {
              const pixel = pixelMatrix.data[fullScreenPosition.y][fullScreenPosition.x];
              return (
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 border-2 border-white"
                      style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
                    ></div>
                    <div>
                      <div>RGB: ({pixel.r}, {pixel.g}, {pixel.b})</div>
                      <div>Cluster: {pixel.cluster + 1}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

