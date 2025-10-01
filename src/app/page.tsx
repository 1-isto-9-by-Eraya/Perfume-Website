// app/page.tsx
"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import {
  Playfair_Display,
  Inter,
  Monsieur_La_Doulaise,
  MonteCarlo,
} from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScroll";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import Preloader from "@/components/Preloader";

const PerfumeCanvas = dynamic(
  () => import("@/components/PerfumeCanvas").then((m) => m.default),
  {
    ssr: false,
    loading: () => <div className="w-full h-full animate-pulse" />,
  }
);

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

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  subsets: ["latin"],
  variable: "--font-monsieur",
  display: "swap",
  weight: "400",
});

const monteCarlo = MonteCarlo({
  subsets: ["latin"],
  variable: "--font-montecarlo",
  display: "swap",
  weight: "400",
});

const maves = localFont({
  src: "./fonts/Maves-Regular.woff2",
  variable: "--font-maves",
  display: "swap",
});

export default function HomePage() {
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const router = useRouter();

  return (
    <>
        <SmoothScrollProvider>
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
              <div className="absolute top-0 md:-top-10 h-[110vh] left-0 w-full z-0 overflow-hidden pointer-events-none">
                {/* Background image */}
                <img
                  // src="/images/smoke-bgt.png"
                  src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/smoke-bgt.png`}
                  alt=""
                  className="absolute top-96 md:-top-20 left-0 w-[120%] md:w-[115%] z-0 overflow-hidden pointer-events-none"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  draggable={false}
                  style={{ transform: "translateZ(0)" }}
                />

                {/* Foreground image - on top */}
                <img
                  // src="/images/E.png"
                  src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/E.png`}
                  alt="sdfghj"
                  className="absolute -left-6 top-0 inset-0 w-[100%] lg:w-[40%] sm:h-[50%] md:h-[70%] lg:h-full object-fit select-none z-10 opacity-60"
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
                <section className="h-screen -mt-24 flex flex-col items-center justify-center px-6 text-center">
                  <h1
                    className={` text-white leading-tight max-w-3xl opacity-0 animate-fadeIn`}
                    style={{ willChange: "opacity, transform" }}
                  >
                    <span
                      className={`${maves.className} block text-[48px] md:text-[96px]`}
                      // style={{ fontFamily: "Maves, sans-serif" }}
                    >
                      SIGNATURE
                    </span>
                    <span
                      className={`${inter.className} text-white/70 font-extralight text-[16px] md:text-[24px]`}
                    >
                      OF THE&nbsp;
                    </span>
                    <span
                      className={`${monteCarlo.className} text-[29px] md:text-[52px]`}
                    >
                      {" "}
                      <span className="md:text-[80px]">A</span>
                      chievers
                    </span>
                  </h1>
                  {/* <img
                  src="/images/Final_Logo.png"
                  alt=""
                  className="absolute z-0 top-24 md:top-4 left-0 md:left-[300px] h-60 w-60 md:w-80 md:h-80 opacity-10"
                /> */}
                  <p
                    className={`${inter.className} mt-2 md:-mt-1 lg:mt-6 font-extralight text-[12px] md:text-[16px] text-[#fffff2]/90 max-w-2xl opacity-0 animate-fadeInDelay`}
                    style={{ willChange: "opacity, transform" }}
                  >
                    For those who lead with quiet power
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href =
                        "https://thehouseoferaya.store/collections/all")
                    }
                    className={`mt-8 inline-flex items-center justify-center px-8 py-2
                    border border-white/80 bg-transparent text-white
                    ${inter.className} font-semibold text-[14px] md:text-[16px] tracking-wide uppercase
                    transition-colors duration-200 cursor-pointer opacity-0 animate-fadeInDelayLong

                   hover:!text-[#EB9C1C] hover:border-[#EB9C1C]
                   active:!bg-[#EB9C1C] active:!text-black active:border-transparent

                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB9C1C]/60`}
                    style={{
                      willChange:
                        "color, background-color, border-color, transform",
                    }}
                  >
                    Shop Now
                  </button>
                </section>

                {/* SECOND SECTION */}
                <section className="h-screen bg-transparent grid lg:grid-cols-2 items-center px-6 lg:px-16 gap-10 mt-32">
                  <div className="p-8 rounded-lg backdrop-blur-sm max-w-xl">
                    <span
                      className={`${inter.className} font-extralight text-[#EB9C1C]`}
                    >
                      Our Identity
                    </span>
                    <h2
                      className={`${playfairDisplay.className} text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-6`}
                    >
                      Scent With Intention
                    </h2>
                    {/* OR using the utility class */}
                    {/* <h2 className="font-maves text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                    Aroma Eros
                  </h2> */}
                    <p
                      className={`${inter.className} text-[#fffff2]/90 mb-8 text-justify text-[14px] md:text-[20px]`}
                    >
                      We believe in depth over display, and in the kind of
                      elegance that doesn't fade with trends. Each 1:9 creation
                      is a study in balance — where minimalism meets richness,
                      and where essence always outweighs appearance
                    </p>
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={() => router.push("/our-story")}
                        className={`mt-8 inline-flex items-center justify-center px-6 py-3 w-1/2
                        border border-white/80 bg-transparent text-white
                        ${inter.className} font-semibold text-[12px] md:text-[16px] tracking-wide uppercase
                        transition-colors duration-200 cursor-pointer opacity-0 animate-fadeInDelayLong

                      hover:!text-[#EB9C1C] hover:border-[#EB9C1C]
                      active:!bg-[#EB9C1C] active:!text-black active:border-transparent

                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB9C1C]/60`}
                        style={{
                          willChange:
                            "color, background-color, border-color, transform",
                        }}
                      >
                        View Our Story
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href =
                            "https://thehouseoferaya.store/collections/all")
                        }
                        className={`inline-flex items-center justify-center px-8 py-3 w-1/2
                        border border-transparent bg-[#EB9C1C] text-[#191919]
                        ${inter.className} text-[12px] md:text-[16px] font-semibold tracking-wide uppercase
                        transition-colors duration-200 cursor-pointer
                        opacity-0 animate-fadeInDelayLong

                        hover:bg-transparent hover:text-[#EB9C1C] hover:border-[#EB9C1C]
                      active:bg-[#EB9C1C] active:text-black active:border-transparent

                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB9C1C]/60`}
                        style={{
                          willChange:
                            "color, background-color, border-color, transform",
                        }}
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                  <div className="hidden lg:block" />
                </section>
              </div>
            </div>
          </section>
        </SmoothScrollProvider>
      
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
