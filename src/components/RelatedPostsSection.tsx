'use client';
import { BlogCard } from "./BlogCard";
import React from "react";

// New component for Related Posts Section with Carousel
export function RelatedPostsSection({ posts }: { posts: any[] }) {
  
  
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (posts.length === 0) return;

  }, [posts.length]);
  
  // Limit to 5 posts for carousel
  const carouselPosts = posts.slice(0, 5);
  const totalPosts = carouselPosts.length;

  // Auto-scroll functionality
  React.useEffect(() => {
    if (isAutoPlaying && totalPosts > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalPosts);
      }, 4000); // Change slide every 4 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, totalPosts]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + totalPosts) % totalPosts);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % totalPosts);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Calculate responsive card widths
  const getTranslateX = () => {
    return `-${currentIndex * 100}%`;
  };

  return (
    <section className="mt-20 pt-16 border-t border-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Related Posts
          </h2>
          <p className="text-gray-400 text-lg">
            Continue exploring our latest content
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons - Desktop */}
          {totalPosts > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-gray-800/80 border border-gray-700 hover:bg-gray-700 transition-all hover:scale-110"
                aria-label="Previous post"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-gray-800/80 border border-gray-700 hover:bg-gray-700 transition-all hover:scale-110"
                aria-label="Next post"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div 
            ref={containerRef}
            className="overflow-hidden rounded-xl"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${getTranslateX()})` }}
            >
              {carouselPosts.map((post) => (
                <div
                  key={post.id}
                  className="w-full flex-shrink-0 px-2 md:px-3"
                >
                  <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                    <BlogCard post={post} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation - Swipe Indicators & Buttons */}
          {totalPosts > 1 && (
            <div className="md:hidden flex items-center justify-between mt-6 px-4">
              <button
                onClick={handlePrevious}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/60 border border-gray-700"
                aria-label="Previous post"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {carouselPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 h-2 bg-white' 
                        : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                    } rounded-full`}
                    aria-label={`Go to post ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 flex  items-center justify-center rounded-full bg-gray-800/60 border border-gray-700"
                aria-label="Next post"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Desktop Dots Indicator */}
          {totalPosts > 1 && (
            <div className="hidden md:flex justify-center gap-2 mt-8">
              {carouselPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-12 h-3 bg-gradient-to-r from-[#9A8E2B] to-[#F5F287]' 
                      : 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
                  } rounded-full`}
                  aria-label={`Go to post ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}