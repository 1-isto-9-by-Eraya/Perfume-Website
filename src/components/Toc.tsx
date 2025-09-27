"use client";

import { useEffect, useRef, useState } from "react";

type Heading = { id: string; text: string };
const BRAND = "#eb9c1c";

export default function Toc({
  headings,
  className = "",
}: {
  headings: Heading[];
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  // refs
  const idsRef = useRef<string[]>([]);
  const topsRef = useRef<number[]>([]);
  const midsRef = useRef<number[]>([]);         // midpoints between section tops
  const targetHoldUntil = useRef<number>(0);    // suppress auto updates after click
  const rAF = useRef<number | null>(null);
  const lastLenisY = useRef<number | null>(null);

  const HEADER_OFFSET = 80; // same visual offset you used
  const HOLD_MS = 1200;     // long enough for Lenis animation

  // Compute/refresh positions; make sure they are sorted by Y
  const computePositions = () => {
    const pairs: Array<{ id: string; top: number }> = [];
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (!el) continue;
      const top = Math.round(
        el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      );
      pairs.push({ id: h.id, top });
    }
    pairs.sort((a, b) => a.top - b.top);

    idsRef.current = pairs.map((p) => p.id);
    topsRef.current = pairs.map((p) => p.top);

    // midpoints between consecutive tops (for hysteresis)
    const mids: number[] = [];
    for (let i = 0; i < pairs.length - 1; i++) {
      mids.push((pairs[i].top + pairs[i + 1].top) / 2);
    }
    midsRef.current = mids;
  };

  // Find active index from a given anchorY using midpoints (stable)
  const indexFromAnchor = (anchorY: number) => {
    const tops = topsRef.current;
    const mids = midsRef.current;
    if (!tops.length) return -1;
    if (tops.length === 1) return 0;

    // If before first midpoint → index 0; if after last midpoint → last
    if (anchorY < mids[0]) return 0;
    if (anchorY >= mids[mids.length - 1]) return tops.length - 1;

    // Binary search on mids to pick the band
    let lo = 0,
      hi = mids.length - 1,
      ans = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (anchorY >= mids[mid]) {
        ans = mid + 1;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  };

  useEffect(() => {
    if (!headings.length) return;

    computePositions();

    const lenis: any = (window as any).lenis;
    const schedule = () => {
      if (rAF.current != null) return;
      rAF.current = requestAnimationFrame(() => {
        rAF.current = null;

        // Honor click-hold to avoid fighting Lenis while it animates
        if (Date.now() < targetHoldUntil.current) return;

        const y =
          lastLenisY.current ??
          window.scrollY ??
          document.documentElement.scrollTop ??
          0;

        // Stable activation line ~35% down the viewport
        const activateOffset = Math.min(window.innerHeight * 0.35, 320);
        const anchorY = y + activateOffset;

        const idx = indexFromAnchor(anchorY);
        if (idx >= 0) {
          const id = idsRef.current[idx];
          if (id && id !== active) setActive(id);
        }
      });
    };

    const onLenisScroll = (e: any) => {
      // Lenis v1 emits object with .scroll; older may send number
      lastLenisY.current =
        typeof e === "number" ? e : typeof e?.scroll === "number" ? e.scroll : null;
      schedule();
    };

    const onScroll = () => schedule();
    const onResize = () => {
      computePositions();
      schedule();
    };

    // Recompute when images finish (layout shift)
    const imgs = Array.from(document.images);
    const imgHandlers: Array<() => void> = [];
    imgs.forEach((img) => {
      if (!img.complete) {
        const fn = () => {
          computePositions();
          schedule();
        };
        imgHandlers.push(fn);
        img.addEventListener("load", fn, { once: true });
        img.addEventListener("error", fn, { once: true });
      }
    });

    // Also observe DOM mutations that can move sections (e.g., embeds)
    const mo = new MutationObserver(() => {
      // throttle recompute on next frame
      requestAnimationFrame(() => {
        computePositions();
        schedule();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    if (lenis?.on) {
      lenis.on("scroll", onLenisScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    // late layout settle
    const t = setTimeout(onResize, 300);

    return () => {
      clearTimeout(t);
      mo.disconnect();
      imgHandlers.forEach((fn, i) => {
        const img = imgs[i];
        if (img) {
          img.removeEventListener("load", fn);
          img.removeEventListener("error", fn);
        }
      });
      if (lenis?.off) lenis.off("scroll", onLenisScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (rAF.current != null) cancelAnimationFrame(rAF.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings.length]); // headings content/length drives recompute

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    setActive(id); // immediate visual feedback
    targetHoldUntil.current = Date.now() + HOLD_MS;

    const top =
      Math.round(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);

    const lenis: any = (window as any).lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(top, {
        duration: 1.0,
        lock: true,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!headings.length) return null;

  return (
    <nav
      aria-label="On this page"
      className={`space-y-4 ${className}`}
      style={{ backgroundColor: "#2a2a2a67" }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-1 h-6" style={{ background: BRAND }} />
        <h3
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: "#fffff2" }}
        >
          Sections
        </h3>
      </div>

      <div className="space-y-2">
        {headings.map((h) => {
          const isActive = active === h.id;
          return (
            <button
              key={h.id}
              onClick={(e) => handleSectionClick(e, h.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-[#eb9c1c]/20 font-medium border-l-4 border-[#eb9c1c]"
                  : "hover:bg-white/10"
              }`}
              style={{ color: isActive ? BRAND : "#ffffff" }}
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isActive ? "bg-[#eb9c1c]" : "bg-gray-500"
                  }`}
                />
                <span className="truncate">{h.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4 mt-6 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>
            {(() => {
              const idx = Math.max(0, idsRef.current.indexOf(active || "") + 1);
              const total = Math.max(1, idsRef.current.length);
              return Math.round((idx / total) * 100);
            })()}
            %
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${(() => {
                const idx = Math.max(0, idsRef.current.indexOf(active || "") + 1);
                const total = Math.max(1, idsRef.current.length);
                return (idx / total) * 100;
              })()}%`,
              background: BRAND,
            }}
          />
        </div>
      </div>
    </nav>
  );
}