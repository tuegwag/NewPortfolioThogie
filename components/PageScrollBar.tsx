"use client";

import { useEffect, useRef, useState } from "react";

const DOT = 12; // px, must match size-3 and the "- 12px" below

// A custom scrollbar for the whole page, styled like the one in the About section:
// a thin line with a dot. The page itself still scrolls normally (mouse wheel,
// touch, keyboard); the browser's own scrollbar is only hidden and replaced.
export default function PageScrollbar() {
  const barRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      barRef.current?.style.setProperty(
        "--sp",
        Math.min(1, Math.max(0, progress)).toFixed(4),
      );
      setScrollable(max > 1);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // The page height changes when images/fonts load or content changes.
    const observer = new ResizeObserver(update);
    observer.observe(root);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  // Click or drag on the line to scroll the page.
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientY - rect.top - DOT / 2) / (rect.height - DOT);
    const clamped = Math.min(1, Math.max(0, ratio));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: clamped * max, behavior: "instant" });
  };

  return (
    <>
      {/* Hide the browser's own page scrollbar (scrolling itself is unchanged). */}
      <style>{`html{scrollbar-width:none}html::-webkit-scrollbar{display:none}`}</style>

      <div
        ref={barRef}
        aria-hidden="true"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          seek(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) seek(e);
        }}
        style={{ ["--sp" as string]: 0 }}
        className={`group fixed inset-y-4 right-1 z-50 flex w-4 sm:inset-y-6 sm:right-3 md:right-5 cursor-pointer touch-none justify-center transition-opacity duration-200 ${
          scrollable ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="h-full w-0.5 rounded-full bg-white/20" />
        <div
          className="absolute left-1/2 size-3 -translate-x-1/2 rounded-full bg-white transition-transform duration-150 group-hover:scale-125 group-active:scale-125"
          style={{ top: "calc(var(--sp) * (100% - 12px))" }}
        />
      </div>
    </>
  );
}