"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { BlogCard } from "@/components/BlogCard";
import {
  HashtagIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Playfair_Display, Inter } from "next/font/google";

type Post = any;
const BRAND = "#EB9C1C";
const BRAND_HOVER = "#f0aa2d"; // a hair brighter for hover
const BRAND_TEXT_ON = "#0b0b0b";

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

/* --------------------------- Skeleton Components --------------------------- */

function BlogCardSkeleton() {
  return (
    <div className="bg-[#1a1d23] border border-gray-700 rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-700"></div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Post type badge */}
        <div className="w-20 h-5 bg-gray-700 rounded-full"></div>

        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>

        {/* Meta info skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            <div className="w-16 h-3 bg-gray-700 rounded"></div>
          </div>
          <div className="w-12 h-3 bg-gray-700 rounded"></div>
        </div>

        {/* Keywords skeleton */}
        <div className="flex flex-wrap gap-1">
          <div className="w-12 h-4 bg-gray-700 rounded-full"></div>
          <div className="w-16 h-4 bg-gray-700 rounded-full"></div>
          <div className="w-10 h-4 bg-gray-700 rounded-full"></div>
        </div>

        {/* Read more skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-8 h-3 bg-gray-700 rounded"></div>
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
      {Array.from({ length: count }, (_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="hidden md:block bg-[#121212] border border-gray-800 rounded-xl p-4 md:p-5 animate-pulse">
      {/* Type filters skeleton */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="w-16 h-8 bg-gray-700 rounded-lg"></div>
        ))}
        <div className="ml-auto w-20 h-8 bg-gray-700 rounded-lg"></div>
      </div>

      {/* Keyword input skeleton */}
      <div className="mt-4 md:mt-5">
        <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
        <div className="w-full h-10 bg-gray-700 rounded-lg"></div>
      </div>

      {/* Popular keywords skeleton */}
      <div className="mt-4 md:mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="w-32 h-4 bg-gray-700 rounded"></div>
          <div className="w-20 h-3 bg-gray-700 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`h-6 bg-gray-700 rounded-full ${
                i === 0 ? "w-16" : i === 1 ? "w-12" : i === 2 ? "w-20" : "w-14"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Mobile Filter ----------------------------- */

// function MobileFilterModal({
//   isOpen,
//   onClose,
//   filters,
//   onFiltersChange,
//   availableKeywords,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   filters: {
//     type: "ALL" | "BLOG" | "VLOG" | "INSTAGRAM";
//     keywords: string[];
//     query: string;
//   };
//   onFiltersChange: (filters: any) => void;
//   availableKeywords: string[];
// }) {
//   const [kwSearch, setKwSearch] = useState("");

//   /* keep hooks at top-level */
//   const visibleKeywords = useMemo(() => {
//     const q = kwSearch.trim().toLowerCase();
//     const list = q
//       ? availableKeywords.filter((k) => k.toLowerCase().includes(q))
//       : availableKeywords;
//     return list.slice(0, 40);
//   }, [kwSearch, availableKeywords]);

//   if (!isOpen) return null;

//   const handleKeywordToggle = (keyword: string) => {
//     const newKeywords = filters.keywords.includes(keyword)
//       ? filters.keywords.filter((k) => k !== keyword)
//       : [...filters.keywords, keyword];
//     onFiltersChange({ ...filters, keywords: newKeywords });
//   };

//   const clearAllFilters = () => {
//     onFiltersChange({ type: "ALL", keywords: [], query: "" });
//   };

//   const TypeButton = ({
//     value,
//     label,
//     emoji,
//   }: {
//     value: "ALL" | "BLOG" | "VLOG" | "INSTAGRAM";
//     label: string;
//     emoji: string;
//   }) => {
//     const active = filters.type === value;
//     return (
//       <button
//         onClick={() => onFiltersChange({ ...filters, type: value })}
//         className={`p-3 rounded-lg border text-left transition-all`}
//         style={
//           active
//             ? {
//                 background: BRAND,
//                 borderColor: BRAND,
//                 color: BRAND_TEXT_ON,
//                 boxShadow: "0 0 0 2px rgba(235,156,28,0.15) inset",
//               }
//             : {
//                 background: "rgba(18,22,28,0.9)",
//                 borderColor: "rgba(235,156,28,0.18)",
//                 color: "#cbd5e1",
//               }
//         }
//         onMouseEnter={(e) => {
//           if (active) (e.currentTarget.style.background = BRAND_HOVER);
//           else e.currentTarget.style.background = "rgba(30,36,46,0.9)";
//         }}
//         onMouseLeave={(e) => {
//           if (active) (e.currentTarget.style.background = BRAND);
//           else e.currentTarget.style.background = "rgba(18,22,28,0.9)";
//         }}
//       >
//         <div className="flex items-center gap-2">
//           <span className="text-lg">{emoji}</span>
//           <span className="font-medium">{label}</span>
//         </div>
//       </button>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black backdrop-blur-sm">
//       <div className="absolute bottom-0 left-0 right-0 bg-[#0d0f12] rounded-t-2xl max-h-[85vh] overflow-hidden">
//         {/* Header */}
//         <div className="sticky top-0 bg-[#0d0f12] border-b border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//               <FunnelIcon className="w-5 h-5" style={{ color: BRAND }} />
//               Filters
//             </h3>
//             <button
//               onClick={onClose}
//               className="p-2 rounded-full transition-colors"
//               style={{ color: "#cbd5e1" }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(235,156,28,0.12)")}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className={`${inter.className} p-4 space-y-6 overflow-y-auto pb-24`}>
//           {/* Post Type */}
//           <div>
//             <h4 className="text-white font-medium mb-3">Content Type</h4>
//             <div className="grid grid-cols-2 gap-3">
//               <TypeButton value="ALL" label="All Posts" emoji="📄" />
//               <TypeButton value="BLOG" label="Blog" emoji="📝" />
//               <TypeButton value="VLOG" label="Vlog" emoji="🎥" />
//               <TypeButton value="INSTAGRAM" label="Instagram" emoji="📷" />
//             </div>
//           </div>

//           {/* Keywords */}
//           <div>
//             <h4 className="text-white font-medium mb-3">Keywords</h4>

//             <div
//               className="rounded-lg border"
//               style={{ background: "rgba(18,22,28,0.9)", borderColor: "rgba(235,156,28,0.2)" }}
//             >
//               <input
//                 value={kwSearch}
//                 onChange={(e) => setKwSearch(e.target.value)}
//                 placeholder="Search keywords…"
//                 className="w-full bg-transparent px-4 py-3 text-gray-200 placeholder-gray-500 rounded-lg focus:outline-none"
//                 style={{
//                   outline: "2px solid transparent",
//                   boxShadow: "inset 0 0 0 1px rgba(235,156,28,0.0)",
//                 }}
//                 onFocus={(e) => (e.currentTarget.parentElement!.style.boxShadow = `0 0 0 2px ${BRAND}30`)}
//                 onBlur={(e) => (e.currentTarget.parentElement!.style.boxShadow = "none")}
//               />
//             </div>

//             <div className="mt-3 space-y-2">
//               {visibleKeywords.map((keyword) => {
//                 const active = filters.keywords.includes(keyword);
//                 return (
//                   <button
//                     key={keyword}
//                     onClick={() => handleKeywordToggle(keyword)}
//                     className="w-full text-left p-3 rounded-lg transition-colors"
//                     style={
//                       active
//                         ? {
//                             background: `${BRAND}33`,
//                             // borderColor: `${BRAND}55`,
//                             color: BRAND,
//                           }
//                         : {
//                             background: "rgba(18,22,28,0.9)",
//                             // borderColor: "rgba(235,156,28,0.18)",
//                             color: "#cbd5e1",
//                           }
//                     }
//                     onMouseEnter={(e) => {
//                       if (!active) e.currentTarget.style.background = "rgba(30,36,46,0.9)";
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!active) e.currentTarget.style.background = "rgba(18,22,28,0.9)";
//                     }}
//                   >
//                     <div className="flex items-center gap-2">
//                       <HashtagIcon className="w-4 h-4" style={{ color: active ? BRAND : "#9aa4b2" }} />
//                       {keyword}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-[#0d0f12] border-t border-[rgba(235,156,28,0.2)] p-4">
//           <div className="flex gap-3">
//             <button
//               onClick={clearAllFilters}
//               className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors"
//               style={{
//                 color: BRAND,
//                 border: `1px solid ${BRAND}`,
//                 background: "transparent",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = `${BRAND}12`)}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             >
//               Clear All
//             </button>
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors"
//               style={{ background: BRAND, color: BRAND_TEXT_ON }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = BRAND_HOVER)}
//               onMouseLeave={(e) => (e.currentTarget.style.background = BRAND)}
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

function MobileFilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableKeywords,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    type: "ALL" | "BLOG" | "VLOG" | "INSTAGRAM";
    keywords: string[];
    query: string;
  };
  onFiltersChange: (filters: any) => void;
  availableKeywords: string[];
}) {
  if (!isOpen) return null;

  // neutral / gray theme
  const BG_OVERLAY = "rgba(0,0,0,0.7)";
  const PANEL_BG = "#0f1115";
  const PANEL_BD = "rgba(255,255,255,0.08)";
  const PANEL_SHADOW =
    "0 20px 60px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.02)";

  const SEC_TITLE = "#e5e7eb";
  const INPUT_BG = "#12161c";
  const INPUT_BD = "rgba(255,255,255,0.12)";
  const INPUT_HV = "#161b23";
  const INPUT_TXT = "#cbd5e1";
  const PLACEHOLDER = "#778397";

  const BTN_BG = "#141922";
  const BTN_BD = "rgba(255,255,255,0.10)";
  const BTN_HV = "#1a2028";
  const BTN_TXT = "#e5e7eb";
  const BTN_ICON = "#9aa4b2";

  const CHIP_BG = "rgba(255,255,255,0.06)";
  const CHIP_BD = "rgba(255,255,255,0.14)";
  const CHIP_TXT = "#cbd5e1";

  const isSelectedType = (v: typeof filters.type) => filters.type === v;

  const typeBtnStyle = (selected: boolean): React.CSSProperties =>
    selected
      ? {
          background: BRAND,
          border: `1px solid ${BRAND_HOVER}`,
          color: BRAND_TEXT_ON,
        }
      : {
          background: BTN_BG,
          border: `1px solid ${BTN_BD}`,
          color: BTN_TXT,
        };

  const kwBtnStyle = (disabled: boolean): React.CSSProperties =>
    disabled
      ? {
          background: `${BRAND}22`,
          border: `1px solid ${BRAND}55`,
          color: BRAND,
          cursor: "not-allowed",
        }
      : {
          background: BTN_BG,
          border: `1px solid ${BTN_BD}`,
          color: BTN_TXT,
        };

  const [kwSearch, setKwSearch] = useState("");
  const visibleKeywords = useMemo(() => {
    const q = kwSearch.trim().toLowerCase();
    const list = q
      ? availableKeywords.filter((k) => k.toLowerCase().includes(q))
      : availableKeywords;
    return list.slice(0, 50);
  }, [availableKeywords, kwSearch]);

  const handleKeywordToggle = (keyword: string) => {
    const newKeywords = filters.keywords.includes(keyword)
      ? filters.keywords.filter((k) => k !== keyword)
      : [...filters.keywords, keyword];
    onFiltersChange({ ...filters, keywords: newKeywords });
  };

  const clearAllFilters = () => {
    onFiltersChange({ type: "ALL", keywords: [], query: "" });
  };

  const PostTypeIcons = {
    ALL: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    BLOG: (
      <svg
        className="w-3.5 h-3.5 text-blue-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 8.707A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    VLOG: (
      <svg
        className="w-4 h-4 mr-2 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    INSTAGRAM: (
      <svg
        className="w-4 h-4 mr-2 text-pink-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  };

  return (
    <div className="fixed inset-0 z-50" style={{ background: BG_OVERLAY }}>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh] overflow-hidden"
        style={{
          background: PANEL_BG,
          borderTop: `1px solid ${PANEL_BD}`,
          boxShadow: PANEL_SHADOW,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-4 py-4"
          style={{
            background: PANEL_BG,
            borderBottom: `1px solid ${PANEL_BD}`,
          }}
        >
          <h3
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: SEC_TITLE }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="opacity-80"
            >
              <path
                fill="currentColor"
                d="M10 18h4v2h-4v-2Zm-7-8h18l-6.5 7.5v3.5h-5v-3.5L3 10Z"
              />
            </svg>
            Filters
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: INPUT_TXT }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = INPUT_HV)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.3 5.71L12 12.01l-6.3-6.3l-1.41 1.42L10.59 13.4l-6.3 6.3l1.41 1.41l6.3-6.3l6.3 6.3l1.41-1.41l-6.3-6.3l6.3-6.3z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-6 overflow-y-auto pb-24">
          {/* Content Type */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: SEC_TITLE }}>
              Content Type
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "ALL", label: "All Posts", icon: PostTypeIcons.ALL },
                { value: "BLOG", label: "Blog", icon: PostTypeIcons.BLOG },
                { value: "VLOG", label: "Vlog", icon: PostTypeIcons.VLOG },
                {
                  value: "INSTAGRAM",
                  label: "Instagram",
                  icon: PostTypeIcons.INSTAGRAM,
                },
              ].map((opt) => {
                const selected = isSelectedType(opt.value as any);
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      onFiltersChange({ ...filters, type: opt.value })
                    }
                    className="p-3 rounded-lg border text-left transition-colors"
                    style={typeBtnStyle(selected)}
                    onMouseEnter={(e) => {
                      if (!selected) e.currentTarget.style.background = BTN_HV;
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) e.currentTarget.style.background = BTN_BG;
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg"
                        style={{ opacity: selected ? 0.9 : 0.8 }}
                      >
                        {opt.icon}
                      </span>
                      <span className="font-medium">{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: SEC_TITLE }}>
              Keywords
            </h4>

            {/* Search */}
            <div
              className="rounded-lg overflow-hidden border"
              style={{ borderColor: INPUT_BD }}
            >
              <input
                value={kwSearch}
                onChange={(e) => setKwSearch(e.target.value)}
                placeholder="Search keywords…"
                className="w-full px-4 py-3 outline-none"
                style={{
                  background: INPUT_BG,
                  color: INPUT_TXT,
                  caretColor: INPUT_TXT,
                }}
              />
            </div>

            {/* List */}
            <div className="mt-3 space-y-2">
              {visibleKeywords.map((kw) => {
                const disabled = filters.keywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => !disabled && handleKeywordToggle(kw)}
                    disabled={disabled}
                    className="w-full text-left p-3 rounded-lg border transition-colors"
                    style={kwBtnStyle(disabled)}
                    onMouseEnter={(e) => {
                      if (!disabled) e.currentTarget.style.background = BTN_HV;
                    }}
                    onMouseLeave={(e) => {
                      if (!disabled) e.currentTarget.style.background = BTN_BG;
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: disabled ? BRAND : BTN_ICON }}>
                        #
                      </span>
                      <span className="capitalize">{kw}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 px-4 py-4 grid grid-cols-2 gap-3"
          style={{ background: PANEL_BG, borderTop: `1px solid ${PANEL_BD}` }}
        >
          <button
            onClick={clearAllFilters}
            className="py-3 px-4 rounded-lg font-medium transition-colors"
            style={{
              background: "transparent",
              border: `1px solid ${CHIP_BD}`,
              color: INPUT_TXT,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = CHIP_BG)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-lg font-medium transition-colors"
            style={{
              background: BRAND,
              color: BRAND_TEXT_ON,
              border: `1px solid ${BRAND_HOVER}`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = BRAND_HOVER)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = BRAND)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Compact Summary ---------------------------- */

// function FilterSummary({
//   filters,
//   onOpenModal,
//   filteredCount,
//   totalCount,
// }: {
//   filters: any;
//   onOpenModal: () => void;
//   filteredCount: number;
//   totalCount: number;
// }) {
//   const activeFiltersCount =
//     (filters.type !== "ALL" ? 1 : 0) + filters.keywords.length + (filters.query ? 1 : 0);

//   const active = activeFiltersCount > 0;

//   return (
//     <button
//       onClick={onOpenModal}
//       className="w-full p-3 rounded-lg flex items-center justify-between transition-colors"
//       style={{
//         background: "rgba(18,22,28,0.9)",
//         border: `1px solid ${active ? `${BRAND}55` : "rgba(235,156,28,0.2)"}`,
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(30,36,46,0.9)")}
//       onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(18,22,28,0.9)")}
//     >
//       <div className="flex items-center gap-2">
//         <FunnelIcon className="w-4 h-4" style={{ color: BRAND }} />
//         <span className={`${inter.className} text-white text-sm`}>
//           {active ? `${activeFiltersCount} filters active` : "All posts"}
//         </span>
//         {active && (
//           <span
//             className="px-2 py-0.5 text-xs rounded-full"
//             style={{ background: `${BRAND}33`, color: BRAND }}
//           >
//             {filteredCount}
//           </span>
//         )}
//       </div>
//       <div className="flex items-center gap-2 text-sm" style={{ color: "#cbd5e1" }}>
//         <span>
//           {filteredCount} of {totalCount}
//         </span>
//         <ChevronDownIcon className="w-4 h-4" />
//       </div>
//     </button>
//   );
// }

function FilterSummary({
  filters,
  onOpenModal,
  filteredCount,
  totalCount,
}: {
  filters: any;
  onOpenModal: () => void;
  filteredCount: number;
  totalCount: number;
}) {
  const activeFiltersCount =
    (filters.type !== "ALL" ? 1 : 0) +
    filters.keywords.length +
    (filters.query ? 1 : 0);

  const active = activeFiltersCount > 0;

  // Neutral palette (keeps the summary bar dark/gray)
  const BG = "#0f1115";
  const BG_HOVER = "#151a1f";
  const BORDER = "rgba(255,255,255,0.06)";
  const BORDER_ON = "rgba(255,255,255,0.12)";
  const TEXT_MAIN = "#e5e7eb";
  const TEXT_MUTED = "#cbd5e1";
  const ICON_COL = "#9aa4b2";
  const CHIP_BG = "rgba(255,255,255,0.06)";
  const CHIP_BD = "rgba(255,255,255,0.14)";

  return (
    <button
      onClick={onOpenModal}
      className="w-full p-3 rounded-lg flex items-center justify-between transition-colors"
      style={{
        background: BG,
        border: `1px solid ${active ? BORDER_ON : BORDER}`,
        boxShadow: "0 1px 0 rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.35)", // lifts it so it doesn’t blend with the page
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = BG_HOVER)}
      onMouseLeave={(e) => (e.currentTarget.style.background = BG)}
    >
      <div className="flex items-center gap-2">
        <FunnelIcon className="w-4 h-4" style={{ color: ICON_COL }} />
        <span className="text-sm" style={{ color: TEXT_MAIN }}>
          {active ? `${activeFiltersCount} filters active` : "All posts"}
        </span>
        {active && (
          <span
            className="px-2 py-0.5 text-xs rounded-full"
            style={{
              background: CHIP_BG,
              border: `1px solid ${CHIP_BD}`,
              color: TEXT_MUTED,
            }}
          >
            {filteredCount == 1 ? "1 post found" : `${filteredCount} posts found`}
          </span>
        )}
      </div>
      <div
        className="flex items-center gap-2 text-sm"
        style={{ color: TEXT_MUTED }}
      >
        {/* <span>
          {filteredCount} of {totalCount} posts
        </span> */}
        <ChevronDownIcon className="w-4 h-4" />
      </div>
    </button>
  );
}

/* ---------------------------- Desktop Filters ---------------------------- */

function DesktopFilters({
  filters,
  setFilters,
  availableKeywords,
  isLoading = false,
}: {
  filters: {
    query: string;
    type: "ALL" | "BLOG" | "VLOG" | "INSTAGRAM";
    keywords: string[];
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      query: string;
      type: "ALL" | "BLOG" | "VLOG" | "INSTAGRAM";
      keywords: string[];
    }>
  >;
  availableKeywords: string[];
  isLoading?: boolean;
}) {
  const [kwInput, setKwInput] = useState("");
  const [showAllPopular, setShowAllPopular] = useState(false);

  if (isLoading) {
    return <FiltersSkeleton />;
  }

  const toggleType = (t: "ALL" | "BLOG" | "VLOG" | "INSTAGRAM") =>
    setFilters((prev) => ({ ...prev, type: t }));

  const toggleKeyword = useCallback(
    (k: string) =>
      setFilters((prev) => ({
        ...prev,
        keywords: prev.keywords.includes(k)
          ? prev.keywords.filter((x) => x !== k)
          : [...prev.keywords, k],
      })),
    [setFilters]
  );

  const suggestions = useMemo(() => {
    const q = kwInput.trim().toLowerCase();
    if (!q) return [];
    return availableKeywords
      .filter(
        (k) => !filters.keywords.includes(k) && k.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [kwInput, availableKeywords, filters.keywords]);

  const popular = useMemo(() => {
    const base = availableKeywords.filter((k) => !filters.keywords.includes(k));
    return showAllPopular ? base : base.slice(0, 14);
  }, [availableKeywords, filters.keywords, showAllPopular]);

  const addFreeform = () => {
    const k = kwInput.trim();
    if (!k) return;
    setFilters((prev) =>
      prev.keywords.includes(k)
        ? prev
        : { ...prev, keywords: [...prev.keywords, k] }
    );
    setKwInput("");
  };

  const removeLastOnBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !kwInput) {
      setFilters((prev) => ({
        ...prev,
        keywords: prev.keywords.slice(0, -1),
      }));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      addFreeform();
    }
  };

  const clearAll = () => setFilters({ query: "", type: "ALL", keywords: [] });

  return (
    <div className="hidden md:block bg-[#121212] border border-gray-800 rounded-xl p-4 md:p-5">
      {/* Content type segmented control */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {(["ALL", "BLOG", "VLOG", "INSTAGRAM"] as const).map((t) => (
          <button
            key={t}
            onClick={() => toggleType(t)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              filters.type === t
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
            }`}
          >
            {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Selected keywords */}
      {filters.keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.keywords.map((k) => (
            <span
              key={k}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-sm border border-blue-500/30"
            >
              <HashtagIcon className="w-3 h-3" />
              {k}
              <button
                onClick={() => toggleKeyword(k)}
                className="ml-1 hover:text-red-400 transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Keyword input + suggestions */}
      <div className="mt-4 md:mt-5">
        <label className="block text-sm text-gray-400 mb-2">Add keywords</label>
        <div className="relative">
          <input
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            onKeyDown={removeLastOnBackspace}
            placeholder="Type to search… press Enter to add"
            className="w-full px-3 py-2 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {kwInput && suggestions.length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-[#0f0f0f] border border-gray-800 rounded-lg shadow-lg overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    toggleKeyword(s);
                    setKwInput("");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 flex items-center gap-2"
                >
                  <HashtagIcon className="w-4 h-4 text-gray-400" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular keywords */}
      {availableKeywords.length > 0 && (
        <div className="mt-4 md:mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Popular keywords</span>
            <button
              className="text-xs text-gray-400 hover:text-gray-200"
              onClick={() => setShowAllPopular((s) => !s)}
            >
              {showAllPopular ? "Show less" : "Show more"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {popular.map((k) => (
              <button
                key={k}
                onClick={() => toggleKeyword(k)}
                className={`px-2.5 py-1 rounded-full text-xs border ${
                  filters.keywords.includes(k)
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                #{k}
              </button>
            ))}
            {popular.length === 0 && (
              <p className="text-sm text-gray-500">All selected.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function BlogIndexClient({
  posts,
  isLoading = false,
}: {
  posts: Post[];
  isLoading?: boolean;
}) {
  const [filters, setFilters] = useState({
    query: "",
    type: "ALL" as "ALL" | "BLOG" | "VLOG" | "INSTAGRAM",
    keywords: [] as string[],
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Extract & rank keywords
  const availableKeywords = useMemo(() => {
    if (isLoading) return [];
    const counts = new Map<string, number>();
    posts.forEach((p) => {
      if (Array.isArray(p.keywords)) {
        p.keywords.forEach((k: string) =>
          counts.set(k, (counts.get(k) || 0) + 1)
        );
      }
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k);
  }, [posts, isLoading]);

  const filtered = useMemo(() => {
    if (isLoading) return [];
    const q = filters.query.trim().toLowerCase();
    return posts.filter((p) => {
      const typeOk =
        filters.type === "ALL" ? true : p.postType === filters.type;

      const qOk =
        !q ||
        (p.title && String(p.title).toLowerCase().includes(q)) ||
        (p.slug && String(p.slug).toLowerCase().includes(q)) ||
        (Array.isArray(p.keywords) &&
          p.keywords.some((k: string) => k.toLowerCase().includes(q)));

      const kwOk =
        filters.keywords.length === 0 ||
        (Array.isArray(p.keywords) &&
          filters.keywords.some((sel) => p.keywords.includes(sel)));

      return typeOk && qOk && kwOk;
    });
  }, [posts, filters, isLoading]);

  return (
    <section className="container mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1
          className={`text-5xl font-semibold text-white mb-6 ${playfairDisplay.className}`}
        >
          Journal
        </h1>
      </div>

      {/* Global Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search posts, keywords..."
          value={filters.query}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, query: e.target.value }))
          }
          disabled={isLoading}
          className={`${inter.className} w-full pl-10 pr-4 py-3 bg-[#121212] text-gray-200 placeholder-gray-500 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
        />
      </div>

      {/* Mobile summary + modal trigger */}
      {isLoading ? (
        <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse"></div>
      ) : (
        <FilterSummary
          filters={filters}
          onOpenModal={() => setIsFilterModalOpen(true)}
          filteredCount={filtered.length}
          totalCount={posts.length}
        />
      )}

      {/* Desktop / tablet filters */}
      <DesktopFilters
        filters={filters}
        setFilters={setFilters}
        availableKeywords={availableKeywords}
        isLoading={isLoading}
      />

      {/* (Optional) Mobile active chips row */}
      {!isLoading &&
        (filters.type !== "ALL" || filters.keywords.length > 0) && (
          <div className="md:hidden flex flex-wrap gap-2">
            {filters.type !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                {filters.type}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, type: "ALL" }))
                  }
                  className="ml-1 hover:text-red-400 transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
              >
                <HashtagIcon className="w-3 h-3" />
                {keyword}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      keywords: prev.keywords.filter((k) => k !== keyword),
                    }))
                  }
                  className="ml-1 hover:text-red-400 transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.keywords.length > 3 && (
              <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm">
                +{filters.keywords.length - 3} more
              </span>
            )}
          </div>
        )}

      {/* Cards Grid or Skeleton */}
      {isLoading ? (
        <SkeletonGrid count={8} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {filtered.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No posts found
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Try adjusting your filters or search terms.
          </p>
          <button
            onClick={() => setFilters({ query: "", type: "ALL", keywords: [] })}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Mobile modal */}
      {!isLoading && (
        <MobileFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          availableKeywords={availableKeywords}
        />
      )}
    </section>
  );
}
