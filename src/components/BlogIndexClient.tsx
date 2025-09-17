"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/BlogCard";

type Post = any;

function ChipsRow({
  chips,
  onPick,
}: {
  chips: string[];
  onPick: (chip: string) => void;
}) {
  return (
    // Edge-to-edge scroll area on mobile; snaps & momentum for nicer UX
    <div className="-mx-4 px-4 mt-3 md:mt-2 overflow-x-hidden">
      <div
        className="flex gap-2 overflow-x-auto overscroll-x-hidden whitespace-nowrap scroll-smooth"
        aria-label="Suggested topics"
      >
        {chips.slice(0, 24).map((c) => (
          <button
            key={c}
            onClick={() => onPick(c)}
            className="px-2.5 py-1 rounded-full text-xs bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BlogIndexClient({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"ALL" | "BLOG" | "VLOG" | "INSTAGRAM">(
    "ALL"
  );

  // Build lightweight chips from titles
  const chips = useMemo(() => {
    const words = posts
      .flatMap((p) => String(p.title || "").split(/\s+/))
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 2 && w.length < 18);
    return Array.from(new Set(words)).slice(0, 40);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const typeOk = type === "ALL" ? true : p.postType === type;
      const qOk =
        !q ||
        (p.title && String(p.title).toLowerCase().includes(q)) ||
        (p.slug && String(p.slug).toLowerCase().includes(q));
      return typeOk && qOk;
    });
  }, [posts, query, type]);

  return (
    <section className="container mx-auto px-4 py-8 space-y-6">
      {/* Top region: responsive columns */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
        {/* Left column (title, search, chips) */}
        <div className="md:flex-1 w-full">
          <h1 className="text-xl font-semibold text-white">Journal</h1>

          {/* Search row — includes the field selector on mobile */}
          <div className="mt-3 flex items-center gap-3">
            <form role="search" className="relative flex-1 min-w-0">
              <label htmlFor="blog-search" className="sr-only">
                Search
              </label>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {/* magnifier */}
                <svg
                  className="w-4 h-4 -mt-1.75 md:-mt-[6.5px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </span>
              <input
                id="blog-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-9 py-2 bg-[#121212] text-gray-200 placeholder-gray-500 rounded-md border border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              {!!query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700/40 text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Clear search"
                >
                  {/* x icon */}
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </form>

            {/* Field select: shown here on mobile, moved to right on md+ */}
            <div className="w-40 sm:w-48 md:block">
              <label htmlFor="field-filter-sm" className="sr-only">
                Select Your Field
              </label>
              <select
                id="field-filter-sm"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#121212] text-gray-200 border border-gray-700 rounded-md px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="ALL">All</option>
                <option value="BLOG">Blog</option>
                <option value="VLOG">Vlog</option>
                <option value="INSTAGRAM">Instagram</option>
              </select>
            </div>
          </div>

          {/* Chips */}
          <ChipsRow
            chips={chips}
            onPick={(chip) => setQuery((q) => (q ? `${q} ${chip}` : chip))}
          />
        </div>

        {/* Right column (desktop-only filter) */}
        <div className="hidden md:block md:w-56 shrink-0">
          <label
            htmlFor="field-filter-md"
            className="block text-xs text-gray-400 mb-1"
          >
            Select Your Field
          </label>
          <select
            id="field-filter-md"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-[#121212] text-gray-200 border border-gray-700 rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <option value="ALL">All</option>
            <option value="BLOG">Blog</option>
            <option value="VLOG">Vlog</option>
            <option value="INSTAGRAM">Instagram</option>
          </select>
        </div>
      </div>

      {/* Cards grid (already responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-base font-medium text-gray-300 mb-1">
            No posts match your filters
          </h3>
          <p className="text-gray-500 text-sm">
            Try clearing the search or changing the field.
          </p>
        </div>
      )}
    </section>
  );
}
