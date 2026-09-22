// src/components/ProjectCard.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ProjectCard({ id, title, meta, price, image }) {
  const location = useLocation();

  return (
    <div className="bg-white p-4 border border-black rounded-none shadow-none">
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

        <div className="mt-4 pt-3 border-t border-neutral-200 flex justify-between items-center">
          <span className="text-xs font-mono font-bold text-black uppercase">
            ₹{price ?? "—"}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 bg-black text-white rounded-none">
            View →
          </span>
        </div>
      </Link>
    </div>
  );
}