// app/pre-order/page.tsx
"use client";

import React from "react";
import { Playfair_Display, Inter } from "next/font/google";

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

export default function PreOrderPage() {
  return (
    <main className="min-h-screen bg-[#000000]">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Single column on tablets, two columns on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden bg-[#0a0a0a]">
            <div className="h-[50vh] sm:h-[60vh] md:h-[500px] lg:h-[600px] xl:h-[70vh] relative flex items-center justify-center">
              <img 
                src="/images/our-story-bottle.png" 
                alt="1:9 Signature Eau de Parfum"
                className="w-full h-full object-contain p-4 md:p-8"
              />
            </div>
          </div>

          {/* Product Details */}
          <section className="flex flex-col justify-between rounded-xl p-6 md:p-8 lg:p-10">
            <div>
              <div className="mb-4">
                <span className={`text-xs md:text-sm ${inter.className} tracking-[0.2em] uppercase text-[#FF8F00]`}>
                  Limited Edition
                </span>
              </div>
              
              <h1 className={`text-3xl md:text-4xl lg:text-5xl ${playfairDisplay.className} text-white mb-4`}>
                1:9 Signature
              </h1>
              
              <p className={`text-sm md:text-base ${inter.className} text-gray-400 mb-6`}>
                Eau de Parfum · 100ml
              </p>

              <div className={`space-y-4 text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed ${inter.className} text-justify`}>
                <p>
                  An extraordinary composition that defies convention. 1:9 Signature opens with 
                  rare Himalayan bergamot and black pepper, evolving through a heart of iris 
                  pallida and Turkish rose absolute, before settling into a base of aged oud, 
                  ambergris, and sacred frankincense.
                </p>
                <p>
                  Each bottle is hand-numbered and comes with a certificate of authenticity. 
                  The crystal flacon features our signature gold-embossed ratio mark, representing 
                  the perfect balance between restraint and expression.
                </p>
              </div>

              <div className="mt-8">
                <p className={`text-3xl md:text-4xl font-semibold text-white ${inter.className}`}>
                  $3,500.00
                </p>
                <p className={`text-sm md:text-base text-gray-400 mt-2 ${inter.className}`}>
                  Expected delivery: March 2025
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button className={`w-full bg-[#EB9C1C] hover:bg-[#FF8F00]/90 text-[#191919] font-semibold py-4 px-6 rounded transition-all duration-300 hover:scale-[1.02] ${inter.className} tracking-wide uppercase text-sm md:text-base`}>
                Pre-Order Now
              </button>
              
              <p className={`text-xs md:text-sm text-gray-500 text-center ${inter.className}`}>
                Limited to 500 pieces worldwide
              </p>
            </div>
          </section>
        </div>

        {/* Optional: Additional details section for tablets */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto xl:hidden">
          <div className="text-center p-4">
            <h3 className={`text-lg font-semibold text-white mb-2 ${inter.className}`}>Limited Edition</h3>
            <p className={`text-sm text-gray-400 ${inter.className}`}>Only 500 pieces available worldwide</p>
          </div>
        </div>
      </div>
    </main>
  );
}