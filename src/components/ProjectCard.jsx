import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ProjectCard({ id, title, meta, price, image, onApply }) {
  const location = useLocation();

  return (
    <div className="bg-white p-4 border border-black rounded-none shadow-none flex flex-col justify-between">
      {/* Main Clickable Card Area (Goes to Details) */}
      <Link
        to={`/projects/${id}`}
        state={{ background: location }}
        className="block"
      >
        <div className="w-full h-40 bg-[#F3F3EF] border border-black rounded-none mb-3 overflow-hidden">
          <img
            src={image || "https://placehold.co/600x400"}
            alt={title}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 rounded-none"
          />
        </div>

        <h3 className="font-bold text-[#0A0A0A] uppercase tracking-tight">{title}</h3>
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-0.5">{meta}</p>
      </Link>

      {/* Bottom Action Bar */}
      <div className="mt-4 pt-3 border-t border-neutral-200 flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-black uppercase">
          ₹{price ?? "—"}
        </span>
        
        <div className="flex gap-2 items-center">
          {/* Apply Button - Triggers submission modal */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onApply) onApply({ id, title });
            }}
            className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 bg-white border border-black text-black hover:bg-black hover:text-white transition rounded-none cursor-pointer"
          >
            Apply →
          </button>

          {/* View Details Link */}
          <Link
            to={`/projects/${id}`}
            state={{ background: location }}
            className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 bg-black text-white rounded-none"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}