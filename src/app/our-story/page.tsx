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
  mobileHeight: string; // e.g., '200px'
  mobileWidth: string; // e.g., 'calc(50% - 0.5rem)'
  mobileTop: string; // e.g., '0px' or '10%'
  mobileLeft: string; // e.g., '0px' or '50%'
  desktopHeight: string; // e.g., '300px'
  desktopWidth: string; // e.g., 'calc(33.333% - 0.666rem)'
  desktopTop: string; // e.g., '0px' or '10%'
  desktopLeft: string; // e.g., '0px' or '33%'
  text: string;
}

export default function OurStoryPage() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [containerHeight, setContainerHeight] = useState("auto");

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 768;
      setIsDesktop(newIsDesktop);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Recalculate container height whenever isDesktop or items change
  useEffect(() => {
    const calculateContainerHeight = () => {
      let maxBottom = 0;
      items.forEach((item) => {
        const top =
          parseFloat(isDesktop ? item.desktopTop : item.mobileTop) || 0;
        const height =
          parseFloat(isDesktop ? item.desktopHeight : item.mobileHeight) || 0;
        const bottom = top + height;
        if (bottom > maxBottom) maxBottom = bottom;
      });
      return `${maxBottom}px`;
    };

    setContainerHeight(calculateContainerHeight());
  }, [isDesktop]);

  const items: MoodBoardItem[] = [
    {
      id: 1,
      mobileHeight: "100px",
      mobileWidth: "calc(50% - 0.5rem)",
      mobileTop: "0px",
      mobileLeft: "0px",
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
      desktopHeight: "380px",
      desktopWidth: "calc(33.333% - 0.666rem)",
      desktopTop: "524px",
      desktopLeft: "0px",
      text: "9. Conceptual sketches of user interfaces.",
    },
  ];

  return (
    <main className="bg-black">
      {/* SECTION 1 — "Our Brand Story" */}
      <section className="relative overflow-hidden pt-12 min-h-screen w-full">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left: Stacked images */}
            <div className="relative lg:col-span-5">
              {/* top image (offset) */}
              <div className="oss1i1">
                <Image
                  src="/images/our-story-bottle.png"
                  alt="Perfume bottle"
                  fill
                  className="object-cover"
                />
              </div>

              {/* thin neon frame behind (top-right) */}
              <div
                className="oss1nf"
              >
                <div className="h-full w-full rounded-md bg-black" />
              </div>

              {/* bottom image */}
              <div className="oss1i2">
                <Image
                  src="/images/our-story-bottle.png"
                  alt="Perfume bottle"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right: copy */}
            <div className="relative lg:col-span-7">
              {/* faint watermark */}
              <div
                className={`${playfair.className} pointer-events-none select-none absolute -right-6 -top-6 text-8xl sm:text-9xl font-black text-white/5 leading-none`}
                aria-hidden
              >
                <img
                  src="/images/Final_Logo.png"
                  alt=""
                  className="oss1l relative -top-26 z-0 -left-14 h-[440px] w-[440px] opacity-10"
                />
              </div>

              {/* small label with hairline */}
              <div className="mb-4 flex items-center gap-4">
                <span className="h-[1px] w-16 bg-gradient-to-r from-[#EB9C1C] to-[#EB9C1C]" />
                {/* <span className="h-[1px] w-16 bg-gradient-to-r from-[#9A8E2B] to-[#F5F287]" /> */}
                <span
                  className={`text-[16px] md:text-[20px] font-medium tracking-[0.2em] text-white/70 ${playfair.className}`}
                >
                  ABOUT US
                </span>
              </div>

              {/* headline */}
              <h1
                className={`text-[36px] md:text-[64px] sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.15] ${playfair.className}`}
              >
                Our{" "}
                <span className="italic relative z-10  pr-4 bg-gradient-to-r bg-clip-text text-transparent from-[#EB9C1C] to-[#EB9C1C]">
                {/* <span className="italic relative z-10  pr-4 bg-gradient-to-r bg-clip-text text-transparent from-[#9A8E2B] to-[#F5F287]"> */}
                  Brand Story
                </span>
              </h1>

              {/* paragraph */}
              <p
                className={`mt-16 max-w-2xl md:text-[16px] font-light text-justify leading-snug md:leading-relaxed text-white/80 ${inter.className}`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                eum veritatis cumque delectus voluptatem maiores molestiae
                dolorem excepturi. Tenetur, aperiam aliquid iste minus facilis
                ipsam, dolorum doloremque nam unde assumenda officia asperiores
                iusto culpa rerum deleniti. Voluptates dignissimos architecto
                voluptatibus nam vero. Expedita, vel? Autem odio ea eius enim
                nam vel.
              </p>

              {/* CTA */}
              <div className="mt-8">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-sm bg-white px-6 py-2 text-[12px] font-semibold tracking-wide text-neutral-900 hover:bg-neutral-200 transition"
                >
                  READ MORE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Mood Board */}
      <section className="relative z-10 bg-black py-12 lg:py-20">
        <div className="p-4">
          <h2
            className={`${playfair.className} text-white text-3xl sm:text-4xl lg:text-5xl font-semibold mb-10`}
          >
            Mood Board
          </h2>

          <div className="relative w-full ml-1.5" style={{ height: containerHeight }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="absolute rounded-lg bg-[#2a2a2a67] overflow-hidden"
                style={{
                  height: isDesktop ? item.desktopHeight : item.mobileHeight,
                  width: isDesktop ? item.desktopWidth : item.mobileWidth,
                  top: isDesktop ? item.desktopTop : item.mobileTop,
                  left: isDesktop ? item.desktopLeft : item.mobileLeft,
                }}
              >
                <div className="p-4 text-white">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — (placeholder) */}
      {/* Add your third block here when you're ready */}
    </main>
  );
}
