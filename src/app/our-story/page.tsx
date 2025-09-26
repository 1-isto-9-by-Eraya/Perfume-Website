"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

interface MoodBoardItem {
  id: number;
  mobileHeight: string;
  mobileWidth: string;
  mobileTop: string;
  mobileLeft: string;
  tabletHeight: string;
  tabletWidth: string;
  tabletTop: string;
  tabletLeft: string;
  desktopHeight: string;
  desktopWidth: string;
  desktopTop: string;
  desktopLeft: string;
  text: string;
}

export default function OurStoryPage() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [containerHeight, setContainerHeight] = useState("auto");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Recalculate container height for mood board
  useEffect(() => {
    const calculateContainerHeight = () => {
      let maxBottom = 0;
      items.forEach((item) => {
        let top = 0;
        let height = 0;
        
        switch(screenSize) {
          case 'mobile':
            top = parseFloat(item.mobileTop) || 0;
            height = parseFloat(item.mobileHeight) || 0;
            break;
          case 'tablet':
            top = parseFloat(item.tabletTop) || 0;
            height = parseFloat(item.tabletHeight) || 0;
            break;
          case 'desktop':
            top = parseFloat(item.desktopTop) || 0;
            height = parseFloat(item.desktopHeight) || 0;
            break;
        }
        
        const bottom = top + height;
        if (bottom > maxBottom) maxBottom = bottom;
      });
      return `${maxBottom + 20}px`; // Add some padding
    };

    setContainerHeight(calculateContainerHeight());
  }, [screenSize]);

  const items: MoodBoardItem[] = [
    {
      id: 1,
      mobileHeight: "100px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "0px",
      mobileLeft: "0px",
      tabletHeight: "120px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "0px",
      tabletLeft: "0px",
      desktopHeight: "100px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "0px",
      desktopLeft: "0px",
      text: "1. Inspirational quote about creativity and design.",
    },
    {
      id: 2,
      mobileHeight: "150px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "0px",
      mobileLeft: "calc(50% + 0.5rem)",
      tabletHeight: "180px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "0px",
      tabletLeft: "calc(33.333% + 0.333rem)",
      desktopHeight: "200px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "0px",
      desktopLeft: "calc(32.5% + 12px)",
      text: "2. Color palette ideas for autumn themes.",
    },
    {
      id: 3,
      mobileHeight: "250px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "112px",
      mobileLeft: "0px",
      tabletHeight: "280px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "0px",
      tabletLeft: "calc(66.666% + 0.666rem)",
      desktopHeight: "350px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "0px",
      desktopLeft: "calc(65.8% + 12px)",
      text: "3. Texture samples from natural elements.",
    },
    {
      id: 4,
      mobileHeight: "100px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "160px",
      mobileLeft: "calc(50% + 0.5rem)",
      tabletHeight: "130px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "190px",
      tabletLeft: "calc(33.333% + 0.333rem)",
      desktopHeight: "150px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "212px",
      desktopLeft: "calc(32.5% + 12px)",
      text: "4. Typography examples for modern fonts.",
    },
    {
      id: 5,
      mobileHeight: "300px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "374px",
      mobileLeft: "0px",
      tabletHeight: "320px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "132px",
      tabletLeft: "0px",
      desktopHeight: "400px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "112px",
      desktopLeft: "0px",
      text: "5. Mood imagery: serene landscapes.",
    },
    {
      id: 6,
      mobileHeight: "180px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "270px",
      mobileLeft: "calc(50% + 0.5rem)",
      tabletHeight: "200px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "330px",
      tabletLeft: "calc(33.333% + 0.333rem)",
      desktopHeight: "250px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "374px",
      desktopLeft: "calc(32.5% + 12px)",
      text: "6. Pattern designs inspired by geometry.",
    },
    {
      id: 7,
      mobileHeight: "220px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "686px",
      mobileLeft: "0px",
      tabletHeight: "440px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "290px",
      tabletLeft: "calc(66.666% + 0.666rem)",
      desktopHeight: "540px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "362px",
      desktopLeft: "calc(65.8% + 12px)",
      text: "7. Lighting concepts for interior spaces.",
    },
    {
      id: 8,
      mobileHeight: "120px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "460px",
      mobileLeft: "calc(50% + 0.5rem)",
      tabletHeight: "180px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "540px",
      tabletLeft: "calc(33.333% + 0.333rem)",
      desktopHeight: "268px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "636px",
      desktopLeft: "calc(32.5% + 12px)",
      text: "8. Material swatches: wood and metal.",
    },
    {
      id: 9,
      mobileHeight: "280px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "590px",
      mobileLeft: "calc(50% + 0.5rem)",
      tabletHeight: "300px",
      tabletWidth: "calc(33.333% - 0.666rem)",
      tabletTop: "462px",
      tabletLeft: "0px",
      desktopHeight: "380px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "524px",
      desktopLeft: "0px",
      text: "9. Conceptual sketches of user interfaces.",
    },
  ];

  const getCurrentItemStyle = (item: MoodBoardItem) => {
    switch(screenSize) {
      case 'mobile':
        return {
          height: item.mobileHeight,
          width: item.mobileWidth,
          top: item.mobileTop,
          left: item.mobileLeft,
        };
      case 'tablet':
        return {
          height: item.tabletHeight,
          width: item.tabletWidth,
          top: item.tabletTop,
          left: item.tabletLeft,
        };
      case 'desktop':
        return {
          height: item.desktopHeight,
          width: item.desktopWidth,
          top: item.desktopTop,
          left: item.desktopLeft,
        };
      default:
        return {
          height: item.desktopHeight,
          width: item.desktopWidth,
          top: item.desktopTop,
          left: item.desktopLeft,
        };
    }
  };

  return (
    <main className="bg-black">
      {/* SECTION 1 — "Our Brand Story" - Fully Responsive */}
      <section className="relative overflow-hidden pt-8 md:pt-12 min-h-screen w-full">
        <div className="oss1-container mx-auto max-w-7xl">
          <div className="oss1-grid">
            {/* Images Container */}
            <div className="oss1-images relative">
              {/* Main bottle image 1 */}
              <div className="oss1i1">
                <Image
                  src="/images/our-story-bottle.png"
                  alt="Perfume bottle"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 276px"
                />
              </div>

              {/* Neon frame behind */}
              <div className="oss1nf">
                <div className="h-full w-full rounded-md bg-black" />
              </div>

              {/* Main bottle image 2 */}
              <div className="oss1i2">
                <Image
                  src="/images/our-story-bottle.png"
                  alt="Perfume bottle"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 276px"
                />
              </div>
            </div>

            {/* Content Container */}
            <div className="oss1-content relative">
              {/* Background watermark logo */}
              <div
                className={`${playfair.className} pointer-events-none select-none absolute -right-6 -top-6 text-8xl sm:text-9xl font-black text-white/5 leading-none`}
                aria-hidden="true"
              >
                <img
                  src="/images/Final_Logo.png"
                  alt=""
                  className="oss1l"
                />
              </div>

              {/* Label with hairline */}
              <div className="oss1-label flex items-center gap-4">
                <span className="h-[1px] bg-gradient-to-r from-[#EB9C1C] to-[#EB9C1C]" />
                <span
                  className={`font-medium tracking-[0.2em] text-white/70 ${playfair.className}`}
                >
                  ABOUT US
                </span>
              </div>

              {/* Headline */}
              <h1
                className={`oss1-headline font-semibold text-white leading-[1.15] ${playfair.className}`}
              >
                Our{" "}
                <span className="italic relative z-10 w-full bg-gradient-to-r text-[#eb9c1c]">
                  Brand Story
                </span>
              </h1>

              {/* Paragraph */}
              <p
                className={`oss1-paragraph font-light text-justify text-white/80 ${inter.className}`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                eum veritatis cumque delectus voluptatem maiores molestiae
                dolorem excepturi. Tenetur, aperiam aliquid iste minus facilis
                ipsam, dolorum doloremque nam unde assumenda officia asperiores
                iusto culpa rerum deleniti. Voluptates dignissimos architecto
                voluptatibus nam vero. Expedita, vel? Autem odio ea eius enim
                nam vel.
              </p>

              {/* CTA Button */}
              <div className="mt-6 md:mt-8">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-sm bg-white px-4 py-2 md:px-6 text-[11px] md:text-[12px] font-semibold tracking-wide text-neutral-900 hover:bg-neutral-200 transition-colors duration-200"
                >
                  READ MORE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Mood Board - Enhanced Responsive */}
      <section className="relative z-10 bg-black py-8 md:py-12 lg:py-20">
        <div className="p-4 md:p-6">
          <h2
            className={`${playfair.className} text-white text-2xl md:text-3xl lg:text-6xl xl:text-8xl font-semibold mb-8 md:mb-10`}
          >
            Mood Board
          </h2>

          <div 
            className="relative w-full ml-1.5 transition-all duration-300 ease-out" 
            style={{ height: containerHeight }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="absolute rounded-lg bg-[#2a2a2a67] overflow-hidden transition-all duration-300 ease-out"
                style={getCurrentItemStyle(item)}
              >
                <div className="p-3 md:p-4 text-white text-sm md:text-base">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Placeholder for future content */}
      <section className="relative bg-black py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Add your third section content here */}
        </div>
      </section>
    </main>
  );
}