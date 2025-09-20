// components/ScrollTriggerProvider.tsx - Fixed TypeScript issues
"use client";

import { PropsWithChildren, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Configure GSAP defaults
  gsap.config({
    nullTargetWarn: false,
    force3D: true,
    autoSleep: 60,
    units: { rotation: "rad" }
  });
  
  // Configure ScrollTrigger defaults
  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 200,
    ignoreMobileResize: true
  });
  
  ScrollTrigger.defaults({
    markers: false,
    toggleActions: "play none none none",
    fastScrollEnd: true,
    preventOverlaps: true,
    onRefreshInit: () => gsap.set(".gsap-marker-start, .gsap-marker-end", { force3D: false })
  });
}

export default function ScrollTriggerProvider({ children }: PropsWithChildren) {
  // Fixed useRef with proper initialization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isRefreshingRef = useRef(false);
  const lastRefreshRef = useRef(0);
  
  // Debounced refresh with rate limiting
  const debouncedRefresh = useCallback(() => {
    if (isRefreshingRef.current) return;
    
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;
    
    // Rate limit refreshes to once per 100ms minimum
    if (timeSinceLastRefresh < 100) {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        debouncedRefresh();
      }, 100 - timeSinceLastRefresh);
      return;
    }
    
    isRefreshingRef.current = true;
    lastRefreshRef.current = now;
    
    ScrollTrigger.refresh();
    
    // Reset flag after refresh completes
    requestAnimationFrame(() => {
      isRefreshingRef.current = false;
    });
  }, []);
  
  useEffect(() => {
    // Handle resize with debouncing and performance optimization
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Add class to stop animations during resize
      document.body.classList.add('resize-animation-stopper');
      
      resizeTimeoutRef.current = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
        
        // Only refresh if window size actually changed significantly
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        const lastWidth = parseInt(document.body.getAttribute('data-last-width') || '0');
        const lastHeight = parseInt(document.body.getAttribute('data-last-height') || '0');
        
        if (Math.abs(currentWidth - lastWidth) > 50 || Math.abs(currentHeight - lastHeight) > 50) {
          document.body.setAttribute('data-last-width', currentWidth.toString());
          document.body.setAttribute('data-last-height', currentHeight.toString());
          debouncedRefresh();
        }
      }, 250);
    };
    
    // Handle orientation change
    const handleOrientationChange = () => {
      // Wait for orientation change to complete
      setTimeout(() => {
        debouncedRefresh();
      }, 500);
    };
    
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refresh when page becomes visible again
        requestAnimationFrame(() => {
          debouncedRefresh();
        });
      } else {
        // Pause all ScrollTriggers when page is hidden
        ScrollTrigger.getAll().forEach(st => {
          if (st.animation) {
            st.animation.pause();
          }
        });
      }
    };
    
    // Handle images loading with IntersectionObserver for performance
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (!img.complete) {
            img.addEventListener('load', debouncedRefresh, { once: true });
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    // Observe all images
    const observeImages = () => {
      document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
      });
    };
    
    // Initial setup
    observeImages();
    document.body.setAttribute('data-last-width', window.innerWidth.toString());
    document.body.setAttribute('data-last-height', window.innerHeight.toString());
    
    // Mutation observer for dynamic content
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldRefresh = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const element = node as HTMLElement;
              // Check if element or its children have ScrollTrigger
              if (element.querySelector('[data-gsap]') || element.hasAttribute('data-gsap')) {
                shouldRefresh = true;
              }
              // Observe new images
              element.querySelectorAll('img').forEach(img => {
                imageObserver.observe(img);
              });
            }
          });
        }
      });
      
      if (shouldRefresh) {
        debouncedRefresh();
      }
    });
    
    // Start observing document for changes
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Attach event listeners
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial refresh after mount with delay for stability
    const initTimer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 100);
    
    // Handle scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Cleanup function
    return () => {
      clearTimeout(initTimer);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      imageObserver.disconnect();
      mutationObserver.disconnect();
      
      // Kill all ScrollTriggers and clear caches
      ScrollTrigger.getAll().forEach(st => {
        st.kill();
      });
      
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.clearMatchMedia();
      
      // Restore scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [debouncedRefresh]);
  
  return <>{children}</>;
}

// Add global styles for resize stopper
if (typeof window !== 'undefined' && !document.getElementById('resize-stopper-styles')) {
  const style = document.createElement('style');
  style.id = 'resize-stopper-styles';
  style.textContent = `
    .resize-animation-stopper,
    .resize-animation-stopper *,
    .resize-animation-stopper *:before,
    .resize-animation-stopper *:after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
}