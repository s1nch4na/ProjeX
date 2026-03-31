// src/components/HorizontalScroller.jsx
import React, { useRef } from "react";

export default function HorizontalScroller({ children, className = "" }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = 400; // adjust based on card width
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full px-3 py-2"
      >
        ◀
      </button>

      {/* Scroll Area */}
      <div
        ref={scrollRef}
        className="flex gap-6 py-2 px-10 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {children}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full px-3 py-2"
      >
        ▶
      </button>
    </div>
  );
}