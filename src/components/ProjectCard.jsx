// src/components/ProjectCard.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ProjectCard({ id, title, meta, price, image }) {
  const location = useLocation();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <Link
        to={`/projects/${id}`}
        state={{ background: location }}
        className="block"
      >
        <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          <img
            src={image || "https://placehold.co/600x400"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="font-semibold text-[#101624]">{title}</h3>
        <p className="text-sm text-gray-500">{meta}</p>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">
            ₹{price ?? "—"}
          </span>
          <span className="text-sm px-3 py-1 bg-[#7c3aed] text-white rounded-md">
            View
          </span>
        </div>
      </Link>
    </div>
  );
}
