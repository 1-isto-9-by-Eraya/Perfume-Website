// src/components/Footer.tsx

// "use client";

// import type React from "react";
// import { useState } from "react";
// import Link from "next/link";
// import { Playfair_Display, Inter } from "next/font/google";

// const playfairDisplay = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-playfair",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const baseStyles = "text-white/70 hover:text-white focus:text-white";

//   const handleNewsletterSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle newsletter subscription logic here
//     console.log("Newsletter subscription:", email);
//     setEmail("");
//   };

//   return (
//     <footer
//       className={`bg-black text-[#fffff2] px-4 md:px-12  pt-16 pb-6 ${inter.className}`}
//     >
//       <div className="w-full ">
//         {/* Top: Brand + Newsletter */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
//           {/* Brand Logo */}
//           <div className="lg:col-span-3 flex items-start">
//             {/* <div className="font-playfair text-2xl text-white">1:9</div> */}
//             <img
//               src="/images/Final_Logo_Footer.png"
//               alt="Eraya Logo"
//               className="h-24 mt-2 mb-0 -ml-8"
//             />
//           </div>

//           {/* Newsletter */}
//           <div className="lg:col-span-9 lg:flex lg:flex-col lg:items-end">
//             <div className="lg:max-w-md lg:text-left">
//               <h3
//                 className={`${playfairDisplay.className} text-white text-xl md:text-2xl font-semibold mb-2`}
//               >
//                 Subscribe to Newsletter
//               </h3>
//               <p className="font-inter text-[14px] text-white mb-3">
//                 Sign up to discover new collections, exclusive offers, and
//                 inspirations from Eraya.
//               </p>
//               {/* <form onSubmit={handleNewsletterSubmit} className="flex items-stretch gap-2 w-full">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email address"
//                   aria-label="Email address"
//                   required
//                   className="flex-1 bg-transparent border border-[#fffff2]/50 focus:border-white focus:outline-none text-xs px-3 py-2 placeholder:text-[#fffff2]/60"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-white text-black text-xs font-medium px-4 py-2 hover:opacity-90 transition-opacity whitespace-nowrap"
//                 >
//                   Confirm
//                 </button>
//               </form> */}
//               <form onSubmit={handleNewsletterSubmit} className="w-full">
//                 <div className="relative group">
//                   {/* Top row: label + arrow submit */}
//                   <div className="flex items-center justify-between">
//                     <button
//                       type="submit"
//                       aria-label="Submit email"
//                       className="p-2 -mr-2 text-[#fffff2]/80 transition-all duration-200 group-focus-within:text-[#fffff2] hover:translate-x-0.5"
//                     >
//                       <span aria-hidden>→</span>
//                     </button>
//                   </div>

//                   {/* Input (invisible box, just the underline) */}
//                   <input
//                     id="newsletter-email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Email address"
//                     aria-label="Email address"
//                     required
//                     className="mt-2 block w-full bg-transparent border-0 border-b border-[#fffff2]/25 focus:border-[#fffff2] outline-none text-sm text-[#fffff2] placeholder-transparent"
//                   />
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Links Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 ">
//           {/* Customer Care */}
//           <div className="">
//             <h3 className="font-inter text-white text-sm font-medium mb-3">
//               Customer Care
//             </h3>
//             <ul className="space-y-2 text-xs">
//               <li>
//                 <Link
//                   href="/contact"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/faqs"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   FAQs
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/shipping"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Shipping & Returns
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/track-order"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Track Order
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Our Services */}
//           <div>
//             <h3 className="font-inter text-white text-sm font-medium mb-3">
//               Our Services
//             </h3>
//             <ul className="space-y-2 text-xs">
//               <li>
//                 <Link
//                   href="/gifting"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Gifting
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/appointment"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Book an Appointment
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* About Eraya */}
//           <div>
//             <h3 className="font-inter text-white text-sm font-medium mb-3">
//               About Eraya
//             </h3>
//             <ul className="space-y-2 text-xs">
//               <li>
//                 <Link
//                   href="/our-story"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Our Story
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/craftsmanship"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Craftsmanship
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/careers"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Careers
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Legal */}
//           <div>
//             <h3 className="font-inter text-white text-sm font-medium mb-3">
//               Legal
//             </h3>
//             <ul className="space-y-2 text-xs">
//               <li>
//                 <Link
//                   href="/terms"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Terms & Conditions
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/privacy"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Privacy & Cookies
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/refund-policy"
//                   className={`font-inter ${baseStyles} transition-colors duration-200`}
//                 >
//                   Refund Policy
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Section - Copyright and Social Icons */}
//         <div className="pt-6 border-t border-[#fffff2]/20">
//           <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
//             {/* Copyright */}
//             <p className="font-inter text-[#fffff2] text-xs text-center md:text-left">
//               © 1:9 by Eraya 2025. All rights reserved.
//             </p>

//             {/* Social Icons */}
//             <div className="flex items-center gap-4">
//               <Link
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Facebook"
//                 className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="w-full h-full"
//                   aria-hidden="true"
//                 >
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                 </svg>
//               </Link>
//               <Link
//                 href="https://instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Instagram"
//                 className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="w-full h-full"
//                   aria-hidden="true"
//                 >
//                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//                 </svg>
//               </Link>
//               <Link
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="X (Twitter)"
//                 className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="w-full h-full"
//                   aria-hidden="true"
//                 >
//                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//                 </svg>
//               </Link>
//               <Link
//                 href="https://linkedin.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="LinkedIn"
//                 className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="w-full h-full"
//                   aria-hidden="true"
//                 >
//                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                 </svg>
//               </Link>
//               <Link
//                 href="https://youtube.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="YouTube"
//                 className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="w-full h-full"
//                   aria-hidden="true"
//                 >
//                   <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//                 </svg>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// src/components/Footer.tsx

"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M7.6 13.2 4.8 10.4a1 1 0 0 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4 0l7.8-7.8a1 1 0 0 0-1.4-1.4L7.6 13.2Z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const baseStyles = "text-white/70 hover:text-white focus:text-white";

  // You can swap this with your real API call; we wrap it to drive UI states
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus("loading");
      // TODO: replace with your real submit (fetch/axios). Demo delay:
      await new Promise((r) => setTimeout(r, 600));
      // console.log("Newsletter subscription:", email);
      setStatus("success");
      // optionally clear after a short delay:
      // setTimeout(() => { setStatus("idle"); setEmail(""); }, 2400);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1600);
    }
  };

  return (
    <footer
      className={`bg-black text-[#fffff2] px-4 md:px-12 pt-16 pb-6 ${inter.className}`}
    >
      <div className="w-full">
        {/* Top: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Brand Logo */}
          <div className="lg:col-span-3 flex items-start">
            <img
              src="/images/Final_Logo_Footer.png"
              alt="Eraya Logo"
              className="h-24 mt-2 mb-0 -ml-8"
            />
          </div>

          {/* Newsletter (video-style inline row) */}
          <div className="lg:col-span-9 lg:flex lg:flex-col lg:items-end">
            <div className="lg:max-w-md lg:text-left w-full">
              <h3
                className={`${playfairDisplay.className} text-white text-xl md:text-2xl font-semibold mb-2`}
              >
                Subscribe to Newsletter
              </h3>
              <p className="font-inter text-[14px] text-white mb-3">
                Sign up to discover new collections, exclusive offers, and
                inspirations from Eraya.
              </p>

              {/* Minimal inline form: label + underline + arrow */}
              <form onSubmit={handleNewsletterSubmit} className="w-full">
                <div className="relative group">
                  {/* Input line (hidden on success) */}
                  <div
                    className={`mt-2 transition-opacity duration-200 ${
                      status === "success"
                        ? "opacity-0 pointer-events-none h-0"
                        : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address " /* label is the visible text */
                        aria-label="Email address"
                        required
                        autoComplete="email"
                        className="block w-full bg-transparent outline-none pl-0.5 text-sm text-[#fffff2]"
                      />
                      <button
                        type="submit"
                        aria-label="Submit email"
                        disabled={status === "loading" || status === "success"}
                        className={`p-2 -mr-2 transition-all duration-200 ${
                          status === "success"
                            ? "text-[#fffff2]/40"
                            : "text-[#fffff2]/80 group-focus-within:text-[#fffff2] hover:translate-x-0.5"
                        } disabled:opacity-40`}
                      >
                        <span aria-hidden>→</span>
                      </button>
                      
                    </div>
                  </div>

                  {/* Success line */}
                  {status === "success" && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                      <CheckIcon className="w-4 h-4  mb-1" />
                      <span className=" mb-1">Thanks for subscribing!</span>
                    </div>
                  )}

                  {/* Underline highlight */}
                  <div
                    className={`absolute left-0 right-0 -bottom-[1px] h-px bg-[#fffff2]/20
                                after:absolute after:left-0 after:top-0 after:h-px after:bg-[#fffff2]
                                after:transition-all after:duration-300
                                ${
                                  status === "success"
                                    ? "after:w-0"
                                    : "group-focus-within:after:w-full after:w-0"
                                }`}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Customer Care */}
          <div>
            <h3 className="font-inter text-white text-sm font-medium mb-3">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/contact"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="font-inter text-white text-sm font-medium mb-3">
              Our Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/gifting"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Gifting
                </Link>
              </li>
              <li>
                <Link
                  href="/appointment"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Book an Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* About Eraya */}
          <div>
            <h3 className="font-inter text-white text-sm font-medium mb-3">
              About Eraya
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/our-story"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/craftsmanship"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Craftsmanship
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-inter text-white text-sm font-medium mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/terms"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Privacy & Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright and Social Icons */}
        <div className="pt-6 border-t border-[#fffff2]/20">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
            <p className="font-inter text-[#fffff2] text-xs text-center md:text-left">
              © 1:9 by Eraya 2025. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className={`w-5 h-5 ${baseStyles} transition-colors duration-200`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
