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

// Preload all critical images including moodboard
const preloadAllImages = () => {
  if (typeof window === 'undefined') return;
  
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || '';
  
  const criticalImages = [
    '/images/Our-story.webp',
    '/images/Final_Logo.png',
    // Preload first 10 moodboard images for faster initial render
    '/images/moodboard/image1.webp',
    '/images/moodboard/image2.webp',
    '/images/moodboard/image3.webp',
    '/images/moodboard/image4.webp',
    '/images/moodboard/image5.webp',
    '/images/moodboard/image6.webp',
    '/images/moodboard/image7.webp',
    '/images/moodboard/image8.webp',
    '/images/moodboard/image9.webp',
    '/images/moodboard/image10.webp',
  ];

  criticalImages.forEach((path) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = `${basePath}${path}`;
    document.head.appendChild(link);
  });
};

export default function OurStoryPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Preload all images on mount
  useEffect(() => {
    preloadAllImages();
  }, []);

  const handleReadMoreToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";

  return (
    <main className="bg-black">
      <div className="w-full text-center flex justify-center items-center uppercase bg-[#eb9c1c] text-white text-[1rem] font-normal px-2 py-2.5">
        <p className={`${inter.className} w-[70%] lg:w-full text-[12px]`}>
          Pre-orders now open | Take 10% off, use WELCOME10 | Shipping begins
          October 27 | Only in India
        </p>
      </div>

      {/* SECTION 1 — "Our Brand Story" - Fully Responsive */}
      <section className="relative overflow-hidden pt-8 md:pt-12 min-h-screen w-full">
        <div className="oss1-container mx-auto max-w-7xl">
          <div className="oss1-grid">
            {/* Images Container */}
            <div className="oss1-images relative">
              {/* Main bottle image */}
              <div className="oss1i2">
                <Image
                  src={`${basePath}/images/Our-story.webp`}
                  alt="Perfume bottle"
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 276px"
                  unoptimized={false}
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
                  src={`${basePath}/images/Final_Logo.png`}
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

              {/* Expandable Paragraphs */}
              <div>
                {/* Paragraph 1 - Always visible */}
                <p
                  className={`oss1-paragraph font-light text-justify text-white/80 ${inter.className}`}
                >
                  Rooted in the balance between the seen and the unseen, 1:9
                  Perfumery was born from a belief: fragrance is not an
                  accessory — it is an extension of identity, a quiet reflection
                  of who you are and the legacy you're building.
                </p>

                {/* Paragraph 2 - Expandable content */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  style={{
                    marginTop: isExpanded ? "0" : "0",
                  }}
                >
                  <p
                    className={`oss1-paragraph font-light text-justify text-white/80 lg:!mt-4 ${inter.className}`}
                  >
                    Our name speaks to our philosophy: one part presence, nine
                    parts essence. We design for those who don't need to
                    announce themselves — those who move with intention, who
                    speak volumes without noise, and who leave a lasting
                    impression without ever saying a word.
                  </p>

                  <p
                    className={`oss1-paragraph font-light text-justify text-white/80 !mt-4 ${inter.className}`}
                  >
                    You create a path even where none exists. Every step
                    reflects clarity, discipline, and the confidence to pursue
                    what truly matters. You are an achiever — not in noise, but
                    in quiet certainty.
                  </p>

                  <p
                    className={`oss1-paragraph font-light text-justify text-white/80 !mt-4 ${inter.className}`}
                  >
                    At 1:9, our fragrances are made for you. Crafted with
                    precision. Rooted in restraint. We create with the same
                    purpose that drives you. You are our inspiration!
                  </p>

                  <p
                    className={`oss1-paragraph font-light text-justify text-white/80 !mt-4 ${inter.className}`}
                  >
                    A world where fragrance becomes statement, identity, and
                    art.
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6 md:mt-8">
                <button
                  type="button"
                  onClick={handleReadMoreToggle}
                  className="inline-flex items-center justify-center rounded-sm bg-white px-4 py-2 md:px-6 text-[11px] md:text-[12px] font-semibold tracking-wide text-neutral-900 hover:bg-neutral-200 transition-colors duration-200"
                >
                  {isExpanded ? "READ LESS" : "READ MORE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Bento Grid Mood Board */}
      <section className="relative bg-black py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <h2
            className={`font-medium text-[1.125rem] tracking-widest text-white/70 ${playfair.className} mb-4 md:mb-6 lg:mb-8`}
          >
            MOODBOARD
          </h2>
          <div className="bg absolute top-[50%] left-0 w-full h-fit flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <h3
                className={`${playfair.className} text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wider mb-2`}
              >
                VIVID | BOLD | UPBEAT
              </h3>
            </div>
          </div>

          {/* Desktop Bento Grid (hidden on mobile) */}
          <div
            className="bg lg:grid-cols-12 gap-3 relative bg-[#EB9C1C] p-2.5 opacity-60"
            style={{ gridAutoRows: "100px" }}
          >
            {/* Row 1 */}
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image1.webp`}
                alt="Mood board 1"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image2.webp`}
                alt="Mood board 2"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image3.webp`}
                alt="Mood board 3"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image4.webp`}
                alt="Mood board 4"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image5.webp`}
                alt="Mood board 5"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image6.webp`}
                alt="Mood board 6"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>

            {/* Row 2 */}
            <div className="col-span-2 row-span-3 col-start-1 row-start-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image7.webp`}
                alt="Mood board 7"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-3 col-start-3 row-start-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image8.webp`}
                alt="Mood board 8"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-3 col-start-9 row-start-0 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image9.webp`}
                alt="Mood board 9"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-11 row-start-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image10.webp`}
                alt="Mood board 10"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>

            {/* Row 3 */}
            <div className="col-span-2 row-span-3 col-start-5 row-start-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image11.webp`}
                alt="Mood board 11"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-7 row-start-5 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image22.webp`}
                alt="Mood board 12"
                fill
                className="object-fit"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-5 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image21.webp`}
                alt="Mood board 13"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>

            {/* Row 4 */}
            <div className="col-span-2 row-span-2 col-start-1 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image13.webp`}
                alt="Mood board 14"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-3 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image14.webp`}
                alt="Mood board 15"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-5 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image15.webp`}
                alt="Mood board 16"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 25vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-4 row-span-3 col-start-7 row-start-7 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image16.webp`}
                alt="Mood board 17"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 25vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-11 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image17.webp`}
                alt="Mood board 18"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>

            {/* Row 5 */}
            <div className="col-span-2 row-span-2 col-start-1 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image18.webp`}
                alt="Mood board 19"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-3 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image19.webp`}
                alt="Mood board 19"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-11 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image20.webp`}
                alt="Mood board 21"
                fill
                className="object-cover"
                loading="eager"
                quality={85}
                sizes="(min-width: 1024px) 16vw"
                unoptimized={false}
              />
            </div>
          </div>

          {/* Mobile Bento Grid */}
          <div className="grid lg:hidden grid-cols-2 auto-rows-[120px] bg-[#EB9C1C] p-[8px] gap-2 relative">
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image1.webp`}
                alt="Mood board 1"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image2.webp`}
                alt="Mood board 2"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image3.webp`}
                alt="Mood board 3"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image4.webp`}
                alt="Mood board 4"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image5.webp`}
                alt="Mood board 5"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image6.webp`}
                alt="Mood board 6"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image7.webp`}
                alt="Mood board 7"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image8.webp`}
                alt="Mood board 8"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image9.webp`}
                alt="Mood board 9"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${basePath}/images/moodboard/image10.webp`}
                alt="Mood board 10"
                fill
                className="object-cover"
                priority
                quality={80}
                sizes="50vw"
                unoptimized={false}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}