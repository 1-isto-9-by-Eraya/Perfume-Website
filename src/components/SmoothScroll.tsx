// components/SmoothScrollProvider.tsx
"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with updated API settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical", // Updated from 'direction' to 'orientation'
      gestureOrientation: "vertical", // Updated from 'gestureDirection' to 'gestureOrientation'
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Make Lenis globally available
    (window as any).lenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Update Lenis on GSAP tick
    const scrollFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(scrollFn);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger configuration
    ScrollTrigger.defaults({
      markers: false,
      scroller: document.body,
    });

    // Critical: Force refresh function that recalculates document height
    const forceRefresh = () => {
      // Force Lenis to recalculate the total scroll height
      lenis.resize();
      // Removed lenis.emit() as it's private - use alternative approach
      lenis.scrollTo(lenis.scroll, { immediate: true });
      
      // Refresh ScrollTrigger
      ScrollTrigger.refresh(true);
    };

    // Handle content changes that affect scroll height
    const handleContentChange = () => {
      // Use multiple refresh attempts with increasing delays
      requestAnimationFrame(() => {
        forceRefresh();
        
        setTimeout(() => {
          forceRefresh();
        }, 50);
        
        setTimeout(() => {
          forceRefresh();
        }, 200);
        
        setTimeout(() => {
          forceRefresh();
        }, 500);
      });
    };

    // Optimized mutation observer for content changes
    const observer = new MutationObserver((mutations) => {
      let needsRefresh = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Check if nodes were added/removed
          if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
            needsRefresh = true;
            break;
          }
        } else if (mutation.type === 'attributes') {
          // Check for style changes that might affect layout
          const target = mutation.target as Element;
          if (mutation.attributeName === 'style' || 
              mutation.attributeName === 'class') {
            needsRefresh = true;
            break;
          }
        }
      }

      if (needsRefresh) {
        handleContentChange();
      }
    });

    // Start observing DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // Handle window events
    const handleResize = () => {
      handleContentChange();
    };

    const handleLoad = () => {
      handleContentChange();
    };

    // Event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleLoad);
    window.addEventListener("orientationchange", handleContentChange);

    // Handle image loading (critical for blog posts with images)
    const handleImageLoad = () => {
      handleContentChange();
    };

    // Monitor existing and future images
    const observeImages = () => {
      // Handle existing images
      document.querySelectorAll('img').forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', handleImageLoad, { once: true });
          img.addEventListener('error', handleImageLoad, { once: true });
        }
      });
    };

    // Monitor for new images being added
    const imageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const images = element.tagName === 'IMG' ? [element] : 
                          Array.from(element.querySelectorAll('img'));
            
            images.forEach((img: Element) => {
              const image = img as HTMLImageElement;
              if (!image.complete) {
                image.addEventListener('load', handleImageLoad, { once: true });
                image.addEventListener('error', handleImageLoad, { once: true });
              }
            });
          }
        });
      });
    });

    imageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial setup
    observeImages();
    
    // Multiple initialization attempts to ensure proper setup
    const initializeScrolling = () => {
      setTimeout(handleContentChange, 100);
      setTimeout(handleContentChange, 500);
      setTimeout(handleContentChange, 1000);
    };

    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeScrolling);
    } else {
      initializeScrolling();
    }

    // Additional refresh when page becomes visible (handles tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(handleContentChange, 100);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("orientationchange", handleContentChange);
      document.removeEventListener('DOMContentLoaded', initializeScrolling);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Disconnect observers
      observer.disconnect();
      imageObserver.disconnect();
      
      // Clean up GSAP
      gsap.ticker.remove(scrollFn);
      ScrollTrigger.getAll().forEach(st => st.kill());
      
      // Destroy Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}