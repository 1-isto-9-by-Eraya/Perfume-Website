// app/page.tsx
"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { Playfair_Display, Inter } from "next/font/google";

const PerfumeCanvas = dynamic(() => import("@/components/PerfumeCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse" />,
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function HomePage() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section id="landing" className="relative text-[#fffff2] bg-black">
        <div
          ref={wrapperRef}
          className="relative h-[200vh]"
          style={{
            contain: "layout paint size style",
            willChange: "transform",
          }}
        >
          {/* Background image - only for first section */}
          <div className="absolute top-0 left-32 w-full z-0 overflow-hidden pointer-events-none">
            <img
              src="/images/landing-background.png"
              alt=""
              className="w-full h-full object-cover select-none"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              draggable={false}
              style={{ transform: "translateZ(0)" }}
            />
          </div>

          {/* Sticky Canvas */}
          <div
            className="sticky top-0 w-full h-screen z-10 pointer-events-none"
            style={{
              contain: "layout paint",
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              perspective: "1000px",
            }}
          >
            <PerfumeCanvas
              containerRef={wrapperRef}
              config={{
                enableAnimation: true,
                // scale: 0.01, 
              }}
            />
          </div>

          {/* Content sections (overlay) */}
          <div className="absolute top-0 left-0 w-full z-20">
            {/* HERO (section 1) */}
            <section className="h-screen -mt-32 flex flex-col items-center justify-center px-6 text-center">
              <h1
                className={`${playfairDisplay.className} text-white text-[70px] leading-tight max-w-3xl opacity-0 animate-fadeIn`}
                style={{ willChange: "opacity, transform" }}
              >
                An Essence That Speaks Without Words
              </h1>
              <p
                className={`${inter.className} text-[#fffff2]/90 mt-6 max-w-2xl opacity-0 animate-fadeInDelay`}
                style={{ willChange: "opacity, transform" }}
              >
                Every perfume tells a story, but 1:9 tells yours. Crafted from
                rare ingredients, each creation unfolds slowly, like a secret
                whispered only to those close enough to hear. It lingers not
                just in the air, but in memory, long after you&apos;re gone.
              </p>
              <button
                className="mt-8 px-8 py-3 bg-gradient-to-r from-[#9A8E2B] to-[#F5F287] text-[#191919] font-inter font-semibold text-sm tracking-wide uppercase hover:bg-[#FF8F00]/90 transition-all duration-300 hover:scale-105 opacity-0 animate-fadeInDelayLong"
                style={{ willChange: "transform" }}
              >
                Shop Now
              </button>
            </section>

            {/* SECOND SECTION */}
            <section className="h-screen bg-transparent grid lg:grid-cols-2 items-center px-6 lg:px-16 gap-10 mt-32">
              <div className="p-8 rounded-lg backdrop-blur-sm max-w-xl">
                <p className="font-inter text-xs tracking-[0.2em] uppercase opacity-80 mb-4">
                  Woody, Bestseller
                </p>
                <h2
                  className={`${playfairDisplay.className} text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-6`}
                >
                  Aroma Eros
                </h2>
                <p className={`${inter.className} text-[#fffff2]/90 mb-8 text-justify`}>
                  A captivating fragrance that embodies passion and desire,
                  blending fresh mint leaves, Italian lemon zest, and green apple
                  with warm notes of tonka bean, amber, geranium flower, and
                  cedarwood. This scent is a bold statement of masculinity and
                  allure, perfect for the modern man who exudes confidence and
                  charisma.
                </p>
                <div className="flex sm:flex-row gap-4">
                  <button className="px-8 py-3 w-1/2 bg-[#ffffff] text-[#191919] font-inter font-medium text-sm tracking-wide uppercase hover:bg-[#ffffff]/90 transition-all duration-300 hover:scale-105">
                    Buy Now
                  </button>
                  <button className="px-8 py-3 w-1/2 border border-[#FF8F00] text-[#FF8F00] font-inter font-medium text-sm tracking-wide uppercase hover:bg-[#FF8F00] hover:text-[#191919] transition-all duration-300 flex items-center justify-center gap-2">
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="hidden lg:block" />
            </section>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDelay {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          50% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDelayLong {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          66% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out forwards;
        }
        .animate-fadeInDelay {
          animation: fadeInDelay 1.8s ease-out forwards;
        }
        .animate-fadeInDelayLong {
          animation: fadeInDelayLong 2.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}
