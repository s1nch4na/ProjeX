// src/components/HorizontalScroller.jsx
import React from "react";

export default function HorizontalScroller({ children, className = "" }) {
  return (
    <div className={`overflow-x-auto no-scrollbar ${className}`}>
      <div className="flex gap-6 py-2 px-1">
        {children}
      </div>
    </div>
  );
}
