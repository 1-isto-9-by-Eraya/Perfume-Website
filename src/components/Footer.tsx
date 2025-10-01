"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const showNewsletter = pathname === '/blog';
  
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const baseStyles = "text-white/70 hover:text-white focus:text-white text-[14px]";

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus("loading");
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
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
        {/* Single Row: Brand Logo | Customer Care | Legal | Newsletter */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            showNewsletter ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-8 lg:gap-12 mb-10`}
        >
          {/* Brand Logo */}
          <div className="flex items-start">
            <img
              // src="/images/Logo_Footer.png"
              src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/Logo_Footer.png`}
              alt="Eraya Logo"
              className="h-24 mt-2 mb-0 -ml-8"
            />
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white text-md font-medium mb-3">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://thehouseoferaya.store/pages/contact-us"
                  className={`${baseStyles} transition-colors duration-200`}
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://thehouseoferaya.store/pages/faq"
                  className={`${baseStyles} transition-colors duration-200`}
                  rel="noopener noreferrer"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="https://thehouseoferaya.store/policies/shipping-policy"
                  className={`${baseStyles} transition-colors duration-200`}
                  rel="noopener noreferrer"
                >
                  Shipping Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-inter text-white text-base font-medium mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://thehouseoferaya.store/policies/terms-of-service"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://thehouseoferaya.store/policies/privacy-policy"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link
                  href="https://thehouseoferaya.store/policies/refund-policy"
                  className={`font-inter ${baseStyles} transition-colors duration-200`}
                >
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter - Only visible on /blog page */}
          {showNewsletter && (
            <div>
              <h3
                className={`${playfairDisplay.className} text-white text-xl md:text-2xl font-semibold mb-2`}
              >
                Subscribe to Newsletter
              </h3>
              <p className={`${inter.className} text-[14px] text-white mb-3`}>
                Sign up to discover new collections, exclusive offers, and
                inspirations from Eraya.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="w-full">
                <div className="relative group">
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
                        placeholder="Email address "
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

                  {status === "success" && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                      <CheckIcon className="w-4 h-4  mb-1" />
                      <span className=" mb-1">Thanks for subscribing!</span>
                    </div>
                  )}

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
          )}
        </div>

        {/* Bottom Section - Copyright and Social Icons */}
        <div className="pt-6 border-t border-[#fffff2]/20">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
            <p className="font-inter text-[#fffff2] text-xs text-center md:text-left">
              © 1:9 by Eraya 2025. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="https://www.instagram.com/1isto9.perfumery/?igsh=MTJkb3E5YW52OGd0cg%3D%3D#"
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}