// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Inter, Playfair_Display } from "next/font/google";

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
//   display: "swap",
// });

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800", "900"],
//   display: "swap",
// });

// interface MoodBoardItem {
//   id: number;
//   mobileHeight: string;
//   mobileWidth: string;
//   mobileTop: string;
//   mobileLeft: string;
//   tabletHeight: string;
//   tabletWidth: string;
//   tabletTop: string;
//   tabletLeft: string;
//   desktopHeight: string;
//   desktopWidth: string;
//   desktopTop: string;
//   desktopLeft: string;
//   text: string;
// }

// export default function OurStoryPage() {
//   const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
//   const [containerHeight, setContainerHeight] = useState("auto");
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       if (width < 768) {
//         setScreenSize('mobile');
//       } else if (width < 1024) {
//         setScreenSize('tablet');
//       } else {
//         setScreenSize('desktop');
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Recalculate container height for mood board
//   useEffect(() => {
//     const calculateContainerHeight = () => {
//       let maxBottom = 0;
//       items.forEach((item) => {
//         let top = 0;
//         let height = 0;

//         switch(screenSize) {
//           case 'mobile':
//             top = parseFloat(item.mobileTop) || 0;
//             height = parseFloat(item.mobileHeight) || 0;
//             break;
//           case 'tablet':
//             top = parseFloat(item.tabletTop) || 0;
//             height = parseFloat(item.tabletHeight) || 0;
//             break;
//           case 'desktop':
//             top = parseFloat(item.desktopTop) || 0;
//             height = parseFloat(item.desktopHeight) || 0;
//             break;
//         }

//         const bottom = top + height;
//         if (bottom > maxBottom) maxBottom = bottom;
//       });
//       return `${maxBottom + 20}px`; // Add some padding
//     };

//     setContainerHeight(calculateContainerHeight());
//   }, [screenSize]);

//   const items: MoodBoardItem[] = [
//     {
//       id: 1,
//       mobileHeight: "100px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "0px",
//       mobileLeft: "0px",
//       tabletHeight: "120px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "0px",
//       tabletLeft: "0px",
//       desktopHeight: "100px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "0px",
//       desktopLeft: "0px",
//       text: "1. Inspirational quote about creativity and design.",
//     },
//     {
//       id: 2,
//       mobileHeight: "150px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "0px",
//       mobileLeft: "calc(50% + 0.5rem)",
//       tabletHeight: "180px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "0px",
//       tabletLeft: "calc(33.333% + 0.333rem)",
//       desktopHeight: "200px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "0px",
//       desktopLeft: "calc(32.5% + 12px)",
//       text: "2. Color palette ideas for autumn themes.",
//     },
//     {
//       id: 3,
//       mobileHeight: "250px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "112px",
//       mobileLeft: "0px",
//       tabletHeight: "280px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "0px",
//       tabletLeft: "calc(66.666% + 0.666rem)",
//       desktopHeight: "350px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "0px",
//       desktopLeft: "calc(65.8% + 12px)",
//       text: "3. Texture samples from natural elements.",
//     },
//     {
//       id: 4,
//       mobileHeight: "100px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "160px",
//       mobileLeft: "calc(50% + 0.5rem)",
//       tabletHeight: "130px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "190px",
//       tabletLeft: "calc(33.333% + 0.333rem)",
//       desktopHeight: "150px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "212px",
//       desktopLeft: "calc(32.5% + 12px)",
//       text: "4. Typography examples for modern fonts.",
//     },
//     {
//       id: 5,
//       mobileHeight: "300px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "374px",
//       mobileLeft: "0px",
//       tabletHeight: "320px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "132px",
//       tabletLeft: "0px",
//       desktopHeight: "400px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "112px",
//       desktopLeft: "0px",
//       text: "5. Mood imagery: serene landscapes.",
//     },
//     {
//       id: 6,
//       mobileHeight: "180px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "270px",
//       mobileLeft: "calc(50% + 0.5rem)",
//       tabletHeight: "200px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "330px",
//       tabletLeft: "calc(33.333% + 0.333rem)",
//       desktopHeight: "250px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "374px",
//       desktopLeft: "calc(32.5% + 12px)",
//       text: "6. Pattern designs inspired by geometry.",
//     },
//     {
//       id: 7,
//       mobileHeight: "220px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "686px",
//       mobileLeft: "0px",
//       tabletHeight: "440px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "290px",
//       tabletLeft: "calc(66.666% + 0.666rem)",
//       desktopHeight: "540px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "362px",
//       desktopLeft: "calc(65.8% + 12px)",
//       text: "7. Lighting concepts for interior spaces.",
//     },
//     {
//       id: 8,
//       mobileHeight: "120px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "460px",
//       mobileLeft: "calc(50% + 0.5rem)",
//       tabletHeight: "180px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "540px",
//       tabletLeft: "calc(33.333% + 0.333rem)",
//       desktopHeight: "268px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "636px",
//       desktopLeft: "calc(32.5% + 12px)",
//       text: "8. Material swatches: wood and metal.",
//     },
//     {
//       id: 9,
//       mobileHeight: "280px",
//       mobileWidth: "calc(50% - 0.5rem)",
//       mobileTop: "590px",
//       mobileLeft: "calc(50% + 0.5rem)",
//       tabletHeight: "300px",
//       tabletWidth: "calc(33.333% - 0.666rem)",
//       tabletTop: "462px",
//       tabletLeft: "0px",
//       desktopHeight: "380px",
//       desktopWidth: "calc(33.333% - 0.666rem)",
//       desktopTop: "524px",
//       desktopLeft: "0px",
//       text: "9. Conceptual sketches of user interfaces.",
//     },
//   ];

//   const getCurrentItemStyle = (item: MoodBoardItem) => {
//     switch(screenSize) {
//       case 'mobile':
//         return {
//           height: item.mobileHeight,
//           width: item.mobileWidth,
//           top: item.mobileTop,
//           left: item.mobileLeft,
//         };
//       case 'tablet':
//         return {
//           height: item.tabletHeight,
//           width: item.tabletWidth,
//           top: item.tabletTop,
//           left: item.tabletLeft,
//         };
//       case 'desktop':
//         return {
//           height: item.desktopHeight,
//           width: item.desktopWidth,
//           top: item.desktopTop,
//           left: item.desktopLeft,
//         };
//       default:
//         return {
//           height: item.desktopHeight,
//           width: item.desktopWidth,
//           top: item.desktopTop,
//           left: item.desktopLeft,
//         };
//     }
//   };

//   const handleReadMoreToggle = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <main className="bg-black">
//       {/* SECTION 1 — "Our Brand Story" - Fully Responsive */}
//       <section className="relative overflow-hidden pt-8 md:pt-12 min-h-screen w-full">
//         <div className="oss1-container mx-auto max-w-7xl">
//           <div className="oss1-grid">
//             {/* Images Container */}
//             <div className="oss1-images relative">
//               {/* Main bottle image 1 */}
//               <div className="oss1i1">
//                 <Image
//                   // src="/images/AUREN.png"
//                   src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/Our-Story-Image-1.webp`}
//                   alt="Perfume bottle"
//                   fill
//                   className="object-cover"
//                   priority
//                   sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 276px"
//                 />
//               </div>

//               {/* Neon frame behind */}
//               <div className="oss1nf">
//                 <div className="h-full w-full rounded-md bg-black" />
//               </div>

//               {/* Main bottle image 2 */}
//               <div className="oss1i2">
//                 <Image
//                   // src="/images/NYSS.png"
//                   src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/Our-Story-Image-2.webp`}
//                   alt="Perfume bottle"
//                   fill
//                   className="object-cover"
//                   sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 276px"
//                 />
//               </div>
//             </div>

//             {/* Content Container */}
//             <div className="oss1-content relative">
//               {/* Background watermark logo */}
//               <div
//                 className={`${playfair.className} pointer-events-none select-none absolute -right-6 -top-6 text-8xl sm:text-9xl font-black text-white/5 leading-none`}
//                 aria-hidden="true"
//               >
//                 <img
//                   // src="/images/Final_Logo.png"
//                   src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/Final_Logo.png`}
//                   alt=""
//                   className="oss1l"
//                 />
//               </div>

//               {/* Label with hairline */}
//               <div className="oss1-label flex items-center gap-4">
//                 <span className="h-[1px] bg-gradient-to-r from-[#EB9C1C] to-[#EB9C1C]" />
//                 <span
//                   className={`font-medium tracking-[0.2em] text-white/70 ${playfair.className}`}
//                 >
//                   ABOUT US
//                 </span>
//               </div>

//               {/* Headline */}
//               <h1
//                 className={`oss1-headline font-semibold text-white leading-[1.15] ${playfair.className}`}
//               >
//                 Our{" "}
//                 <span className="italic relative z-10 w-full bg-gradient-to-r text-[#eb9c1c]">
//                   Brand Story
//                 </span>
//               </h1>

//               {/* Expandable Paragraphs */}
//               <div>
//                 {/* Paragraph 1 - Always visible */}
//                 <p
//                   className={`oss1-paragraph font-light text-justify text-white/80 ${inter.className}`}
//                 >
//                   Rooted in the balance between the seen and the unseen, 1:9 Perfumery was born from a belief:
//                   fragrance is not an accessory — it is an extension of identity, a quiet reflection of who you are
//                   and the legacy you're building.
//                 </p>

//                 {/* Paragraph 2 - Expandable content */}
//                 <div
//                   className={`transition-all duration-500 ease-in-out overflow-hidden ${
//                     isExpanded
//                       ? 'max-h-[2000px] opacity-100'
//                       : 'max-h-0 opacity-0'
//                   }`}
//                   style={{
//                     marginTop: isExpanded ? '0' : '0'
//                   }}
//                 >
//                   <p
//                     className={`oss1-paragraph font-light text-justify text-white/80 lg:!mt-4 ${inter.className}`}
//                   >
//                     Our name speaks to our philosophy: one part presence, nine parts essence. We design for those who
//                     don't need to announce themselves — those who move with intention, who speak volumes without noise,
//                     and who leave a lasting impression without ever saying a word.
//                   </p>

//                   <p
//                     className={`oss1-paragraph font-light text-justify text-white/80 !mt-4 ${inter.className}`}
//                   >
//                     You create a path even where none exists. Every step reflects clarity, discipline, and the confidence
//                     to pursue what truly matters. You are an achiever — not in noise, but in quiet certainty.
//                   </p>

//                   <p
//                     className={`oss1-paragraph font-light text-justify text-white/80 !mt-4 ${inter.className}`}
//                   >
//                     At 1:9, our fragrances are made for you. Crafted with precision. Rooted in restraint.
//                     We create with the same purpose that drives you. You are our inspiration!
//                   </p>

//                   <p
//                     className={`oss1-paragraph font-light text-justify text-white/80 !mt-4 ${inter.className}`}
//                   >
//                     A world where fragrance becomes statement, identity, and art.
//                   </p>
//                 </div>
//               </div>

//               {/* CTA Button */}
//               <div className="mt-6 md:mt-8">
//                 <button
//                   type="button"
//                   onClick={handleReadMoreToggle}
//                   className="inline-flex items-center justify-center rounded-sm bg-white px-4 py-2 md:px-6 text-[11px] md:text-[12px] font-semibold tracking-wide text-neutral-900 hover:bg-neutral-200 transition-colors duration-200"
//                 >
//                   {isExpanded ? 'READ LESS' : 'READ MORE'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* SECTION 2 — Mood Board - Enhanced Responsive */}
//       <section className="relative z-10 bg-black py-8 md:py-12 lg:py-20">
//         <div className="p-4 md:p-6">
//           <h2
//             className={`${playfair.className} text-white text-2xl md:text-3xl lg:text-6xl xl:text-8xl font-semibold mb-8 md:mb-10`}
//           >
//             Mood Board
//           </h2>

//           <div
//             className="relative w-full ml-1.5 transition-all duration-300 ease-out"
//             style={{ height: containerHeight }}
//           >
//             {items.map((item) => (
//               <div
//                 key={item.id}
//                 className="absolute rounded-lg bg-[#2a2a2a67] overflow-hidden transition-all duration-300 ease-out"
//                 style={getCurrentItemStyle(item)}
//               >
//                 <div className="p-3 md:p-4 text-white text-sm md:text-base">
//                   {item.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

"use client";

import React, { useState } from "react";
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

export default function OurStoryPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMoreToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <main className="bg-black">
      <div className="w-full text-center flex justify-center items-center uppercase bg-[#eb9c1c] text-white text-[1rem] font-normal px-2 py-2.5">
        <p className={`${inter.className} w-[70%] lg:w-full`}>
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
              {/* Main bottle image 1 */}
              {/* <div className="oss1i1">
                <Image
                  src={`${
                    process.env.__NEXT_ROUTER_BASEPATH || ""
                  }/images/Our-Story-image-1.webp`}
                  alt="Perfume bottle"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 276px"
                />
              </div> */}

              {/* Neon frame behind */}
              {/* <div className="oss1nf">
                <div className="h-full w-full rounded-md bg-black" />
              </div> */}

              {/* Main bottle image 2 */}
              <div className="oss1i2">
                <Image
                  src={`${
                    process.env.__NEXT_ROUTER_BASEPATH || ""
                  }/images/Our-story.webp`}
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
                  src={`${
                    process.env.__NEXT_ROUTER_BASEPATH || ""
                  }/images/Final_Logo.png`}
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
      <section className="relative bg-black py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12 ">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <h2
            className={`${playfair.className} text-white text-3xl md:text-5xl lg:text-7xl font-semibold mb-8 md:mb-12 lg:mb-16`}
          >
            MOOD BOARD
          </h2>
          <div className="bg absolute top-[50%] left-0 w-full h-fit  flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <h3
                className={`${playfair.className} text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wider mb-2`}
              >
                VIVID | BOLD | UPBEAT
              </h3>
              {/* <p
                className={`${inter.className} text-white/90 text-xl ml-[23%] font-extralight md:text-2xl lg:text-3xl tracking-[0.3em]`}
              >
                OF THE ACHIEVERS
              </p> */}
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
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image1.webp`}
                alt="Mood board 1"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image2.webp`}
                alt="Mood board 2"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image3.webp`}
                alt="Mood board 3"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image4.webp`}
                alt="Mood board 4"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image5.webp`}
                alt="Mood board 5"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image6.webp`}
                alt="Mood board 6"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>

            {/* Row 2 */}
            <div className="col-span-2 row-span-3 col-start-1 row-start-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image7.webp`}
                alt="Mood board 7"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-3 col-start-3 row-start-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image8.webp`}
                alt="Mood board 8"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-3 col-start-9 row-start-0 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image9.webp`}
                alt="Mood board 9"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-11 row-start-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image10.webp`}
                alt="Mood board 10"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>

            {/* Row 3 - Fill the text overlay area */}
            <div className="col-span-2 row-span-3 col-start-5 row-start-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image11.webp`}
                alt="Mood board 11"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-7 row-start-5 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image22.webp`}
                alt="Mood board 12"
                fill
                className="object-fit"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-5 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image21.webp`}
                alt="Mood board 12"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>

            {/* Row 4 */}
            <div className="col-span-2 row-span-2 col-start-1 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image13.webp`}
                alt="Mood board 13"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-3 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image14.webp`}
                alt="Mood board 14"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-5 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image15.webp`}
                alt="Mood board 15"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw"
              />
            </div>
            <div className="col-span-4 row-span-3 col-start-7 row-start-7 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image16.webp`}
                alt="Mood board 16"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-11 row-start-6 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image17.webp`}
                alt="Mood board 17"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>

            {/* Row 5 - Bottom fill */}
            <div className="col-span-2 row-span-2 col-start-1 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image18.webp`}
                alt="Mood board 18"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-3 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image19.webp`}
                alt="Mood board 19"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
            <div className="col-span-2 row-span-2 col-start-11 row-start-8 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image20.webp`}
                alt="Mood board 20"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 16vw"
              />
            </div>
          </div>

          {/* Mobile Bento Grid (visible only on mobile) */}
          <div className="grid lg:hidden grid-cols-2 auto-rows-[120px] bg-[#EB9C1C] p-[8px] gap-2 relative">
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image1.webp`}
                alt="Mood board 1"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image2.webp`}
                alt="Mood board 2"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image3.webp`}
                alt="Mood board 3"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image4.webp`}
                alt="Mood board 4"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image5.webp`}
                alt="Mood board 5"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image6.webp`}
                alt="Mood board 6"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image7.webp`}
                alt="Mood board 7"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image8.webp`}
                alt="Mood board 8"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-4 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image9.webp`}
                alt="Mood board 9"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="row-span-3 relative overflow-hidden rounded-lg">
              <Image
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/moodboard/image10.webp`}
                alt="Mood board 9"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
