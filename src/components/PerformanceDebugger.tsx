"use client";

import { Perf } from "r3f-perf"
import { useEffect, useState } from "react";

export default function PerformanceDebugger() {
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    // Show debug panel with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  if (!showDebug) return null;
  
  return (
    <>
      <Perf 
        position="top-left" 
        showGraph={true}
        minimal={false}
        matrixUpdate
        deepAnalyze
      />
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50">
        <h3 className="font-bold mb-2">Debug Info</h3>
        <p>FPS Target: 60</p>
        <p>Device: {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</p>
        <p>Memory: {performance.memory ? 
          `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB` : 
          'N/A'}</p>
      </div>
    </>
  );
}