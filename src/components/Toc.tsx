"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

export default function Toc({
  headings,
  className = "",
}: {
  headings: Heading[];
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let updateTimeout: NodeJS.Timeout;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Clear any pending updates
        clearTimeout(updateTimeout);
        
        // Debounce the update to prevent glitching
        updateTimeout = setTimeout(() => {
          const intersectingEntries = entries.filter(entry => entry.isIntersecting);
          
          if (intersectingEntries.length > 0) {
            // Sort by position in the document (top to bottom)
            intersectingEntries.sort((a, b) => {
              const aRect = a.boundingClientRect;
              const bRect = b.boundingClientRect;
              
              // Priority to sections that are more visible and closer to top
              if (aRect.top >= 0 && bRect.top >= 0) {
                return aRect.top - bRect.top;
              } else if (aRect.top >= 0) {
                return -1; // Prefer sections that are below the fold
              } else if (bRect.top >= 0) {
                return 1;
              } else {
                return bRect.top - aRect.top; // Both are above, prefer the one closer to top
              }
            });
            
            const newActive = intersectingEntries[0].target.id;
            setActive(prev => prev !== newActive ? newActive : prev);
          }
        }, 50); // 50ms debounce
      },
      {
        rootMargin: "-80px 0px -20% 0px",
        threshold: [0.1, 0.3, 0.6],
      }
    );

    // Track scrolling state to reduce updates during scroll
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(updateTimeout);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [headings]);

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (!element) return;

    // Get Lenis instance if available
    const lenis = (window as any).lenis;
    
    if (lenis) {
      // Use Lenis scrollTo for smooth scrolling
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 80; // 80px offset from top
      
      lenis.scrollTo(targetY, { 
        duration: 1.2, 
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    } else {
      // Fallback to native scroll if Lenis is not available
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Update active state immediately for better UX
    setActive(id);
  };

  if (!headings.length) return null;

  return (
    <div className={`space-y-4 ${className}`} style={{ backgroundColor: '#2a2a2a67' }}>
      <div className="flex items-center space-x-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#fffff2' }}>
          Sections
        </h3>
      </div>
      
      <nav className="space-y-2">
        {headings.map((h) => (
          <button
            key={h.id}
            onClick={(e) => handleSectionClick(e, h.id)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
              active === h.id
                ? "bg-blue-500/20 font-medium border-l-4 border-blue-500"
                : "hover:bg-white/10"
            }`}
            style={{
              color: active === h.id ? '#3b82f6' : '#ffffff'
            }}
          >
            <div className="flex items-center space-x-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                active === h.id ? 'bg-blue-400' : 'bg-gray-500'
              }`} />
              <span className="truncate">{h.text}</span>
            </div>
          </button>
        ))}
      </nav>

      {/* Progress indicator */}
      <div className="pt-4 mt-6 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{Math.round(((headings.findIndex(h => h.id === active) + 1) / headings.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ 
              width: `${((headings.findIndex(h => h.id === active) + 1) / headings.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}