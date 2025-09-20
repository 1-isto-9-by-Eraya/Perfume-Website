// utils/performance.ts
export const trackPerformance = () => {
  if (typeof window === 'undefined') return;
  
  // Track Web Vitals - Updated to use current API
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    onCLS(console.log);
    onINP(console.log); // Replaced onFID with onINP (newer metric)
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  }).catch((error) => {
    console.warn('Failed to load web-vitals:', error);
  });
  
  // Track custom metrics
  window.addEventListener('load', () => {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        console.log('Performance Metrics:', {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstByte: navigation.responseStart - navigation.requestStart,
          totalSize: performance.getEntriesByType('resource').reduce((acc, entry) => {
            // Safely access transferSize with proper typing
            const resourceEntry = entry as PerformanceResourceTiming;
            return acc + (resourceEntry.transferSize || 0);
          }, 0)
        });
      }
    } catch (error) {
      console.warn('Error tracking performance metrics:', error);
    }
  });
};

// Optional: Enhanced performance tracking with more metrics
export const trackAdvancedPerformance = () => {
  if (typeof window === 'undefined') return;

  // Track Web Vitals with custom reporting
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    const reportMetric = (metric: any) => {
      console.log(`${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id
      });
    };

    onCLS(reportMetric);
    onINP(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }).catch((error) => {
    console.warn('Failed to load web-vitals:', error);
  });

  // Track Three.js specific performance for your 3D scene
  const trackThreeJSPerformance = () => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log('Three.js FPS:', fps);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    // Start FPS monitoring
    requestAnimationFrame(measureFPS);
  };

  // Monitor memory usage (Chrome only)
  const trackMemoryUsage = () => {
    const performanceWithMemory = performance as any;
    
    if (performanceWithMemory.memory) {
      setInterval(() => {
        const memoryInfo = {
          used: Math.round(performanceWithMemory.memory.usedJSHeapSize / 1048576),
          total: Math.round(performanceWithMemory.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performanceWithMemory.memory.jsHeapSizeLimit / 1048576)
        };
        
        console.log('Memory Usage (MB):', memoryInfo);
        
        // Warn if memory usage is high
        if (memoryInfo.used > memoryInfo.total * 0.8) {
          console.warn('High memory usage detected');
        }
      }, 10000); // Check every 10 seconds
    }
  };

  // Initialize advanced tracking
  trackThreeJSPerformance();
  trackMemoryUsage();
};