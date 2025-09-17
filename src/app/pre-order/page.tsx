// app/pre-order/page.tsx
"use client";

import React from "react";

export default function PreOrderPage() {
  return (
    <main className="min-h-screen bg-[#000000]">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Product Image (left) */}
          <div className="rounded-xl overflow-hidden bg-[#0a0a0a]">
            <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] relative flex items-center justify-center">
              {/* Replace this div with your actual image */}
              {/* <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-48 mx-auto bg-gradient-to-b from-amber-200 to-amber-600 rounded-lg mb-4 shadow-2xl relative">
                    <div className="absolute inset-2 bg-gradient-to-b from-amber-100 to-amber-500 rounded opacity-80"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gray-800 rounded-sm"></div>
                  </div>
                  <p className="text-gray-400 text-sm font-inter">1:9 Signature Bottle</p>
                </div>
              </div> */}
              
              {/* Uncomment and use this when you have an actual image */}
              
              <img 
                src="/images/our-story-bottle.png" 
                alt="1:9 Signature Eau de Parfum"
                className="w-full h-full object-contain"
              />
             
            </div>
          </div>

          {/* Product Details (right) */}
          <section className="flex flex-col justify-between rounded-xl p-6 md:p-8 lg:p-10">
            <div>
              <div className="mb-4">
                <span className="text-xs font-inter tracking-[0.2em] uppercase text-[#FF8F00]">
                  Limited Edition
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-white mb-4">
                1:9 Signature
              </h1>
              
              <p className="text-sm font-inter text-gray-400 mb-6">
                Eau de Parfum · 100ml
              </p>

              <div className="space-y-3 text-gray-300 text-sm md:text-base leading-relaxed font-inter">
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
                <p className="text-3xl md:text-4xl font-semibold text-white font-playfair">
                  $3,500.00
                </p>
                <p className="text-sm text-gray-400 mt-2 font-inter">
                  Expected delivery: March 2025
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {/* <div className="flex items-center gap-4">
                <label className="text-gray-300 text-sm font-inter">Quantity:</label>
                <div className="flex items-center border border-gray-600 rounded">
                  <button className="px-3 py-1 text-gray-300 hover:bg-gray-700 transition-colors">
                    -
                  </button>
                  <input 
                    type="number" 
                    value="1" 
                    readOnly
                    className="w-12 text-center bg-transparent text-white border-x border-gray-600"
                  />
                  <button className="px-3 py-1 text-gray-300 hover:bg-gray-700 transition-colors">
                    +
                  </button>
                </div>
              </div> */}
              
              <button className="w-full bg-[#FF8F00] hover:bg-[#FF8F00]/90 text-[#191919] font-semibold py-4 px-6 rounded transition-all duration-300 hover:scale-[1.02] font-inter tracking-wide uppercase">
                Pre-Order Now
              </button>
              
              {/* <button className="w-full bg-transparent border border-gray-600 hover:border-[#FF8F00] hover:text-[#FF8F00] text-gray-200 py-4 px-6 rounded transition-all duration-300 font-inter">
                Add to Wishlist
              </button> */}
              
              <p className="text-xs text-gray-500 text-center font-inter">
                Limited to 500 pieces worldwide
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}