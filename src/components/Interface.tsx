// src/components/Interface.tsx

"use client";

import React from "react";

// Responsive Section component
interface SectionProps {
  children: React.ReactNode;
  alignment?: "start" | "center" | "end";
  heightMobile?: string;
  heightDesktop?: string;
  widthMobile?: string;
  widthDesktop?: string;
  className?: string;
}

const Section = ({
  children,
  alignment = "start",
  heightMobile = "min-h-screen",
  heightDesktop = "md:min-h-screen",
  widthMobile = "w-screen",
  widthDesktop = "w-screen",
  className = "",
}: SectionProps) => {
  const alignmentClass =
    alignment === "center"
      ? "justify-center"
      : alignment === "end"
      ? "justify-end"
      : "justify-start";

  return (
    <section
      className={`
        relative flex flex-col items-start ${alignmentClass} 
        px-8 md:px-16 lg:px-24 py-8 max-w-screen-2xl 
        ${widthMobile} md:${widthDesktop} 
        ${heightMobile} ${heightDesktop} 
        section
        ${className}
      `}
    >
      {children}
    </section>
  );
};

export default function Interface() {
  return (
    <div className="flex flex-col items-center w-full" id="main-interface">
      {/* First Hero Section - Full height with centered content */}
      <Section
        alignment="center"
        heightMobile="h-screen"
        heightDesktop="md:h-screen"
        className="bg-transparent relative z-10"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-playfair text-[#ffffff] text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 drop-shadow-lg">
            An Essence That Speaks Without Words
          </h1>
          <p className="font-inter text-[#fffff2] text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90 max-w-3xl mx-auto drop-shadow-md">
            Every perfume tells a story, but 1:9 tells yours. Crafted from rare ingredients, each 
            creation unfolds slowly, like a secret whispered only to those close enough to hear. It 
            lingers not just in the air, but in memory, long after you've gone.
          </p>
        </div>
      </Section>

      {/* Second Section - Split layout with text on left, 3D on right */}
      <Section
        alignment="center"
        heightMobile="h-screen"
        heightDesktop="md:h-screen"
        className="bg-black relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center">
            <div className="max-w-lg">
              {/* Tagline */}
              <p className="font-inter text-[#fffff2] text-sm tracking-[0.2em] uppercase mb-6 opacity-80">
                Tagline
              </p>

              {/* Main Heading */}
              <h2 className="font-playfair text-[#ffffff] text-4xl lg:text-5xl xl:text-6xl leading-tight mb-8">
                Medium length section heading goes here
              </h2>

              {/* Description */}
              <p className="font-inter text-[#fffff2] text-base lg:text-lg leading-relaxed mb-12 opacity-90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                varius enim in eros elementum tristique. Duis cursus, mi quis viverra
                ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-[#FF8F00] text-[#191919] font-inter font-medium text-sm tracking-wide uppercase hover:bg-[#FF8F00]/90 transition-colors duration-300">
                  Button
                </button>
                <button className="px-8 py-3 border border-[#ffffff] text-[#ffffff] font-inter font-medium text-sm tracking-wide uppercase hover:bg-[#ffffff] hover:text-[#191919] transition-all duration-300 flex items-center justify-center gap-2">
                  Button
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Visible content for layout (3D model renders in fixed Canvas) */}
          <div className="relative h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
            <div className="text-center opacity-20">
              <p className="font-inter text-[#fffff2] text-sm">
                3D Model renders here
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Third Section - Example */}
      <Section
        alignment="center"
        heightMobile="h-screen"
        heightDesktop="md:h-screen"
        className="bg-black relative z-10"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="font-playfair text-[#ffffff] text-4xl md:text-6xl leading-tight mb-8">
            Discover Your Story
          </h3>
          <p className="font-inter text-[#fffff2] text-lg md:text-xl leading-relaxed opacity-90 mb-12">
            Each bottle of 1:9 is more than a fragrance – it's a journey waiting to unfold.
          </p>
          <button className="px-12 py-4 bg-[#FF8F00] text-[#191919] font-inter font-medium text-base tracking-wide uppercase hover:bg-[#FF8F00]/90 transition-colors duration-300">
            Explore Collection
          </button>
        </div>
      </Section>
    </div>
  );
}