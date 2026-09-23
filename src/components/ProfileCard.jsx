// src/components/ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ProfileCard({
  id,
  name,
  role,
  skills = [],
  image,
  projectCount = 0,
}) {
  return (
    <Link
      to={`/creators/${id}`}
      className="group block"
    >
      {/* Creator Image */}
      <div className="relative w-full aspect-[4/3] bg-[#E8E8E3] border border-black overflow-hidden">
        <img
          src={image || "https://placehold.co/600x450"}
          alt={name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">

          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
              Creator
            </span>

            <span className="text-lg">
              ↗
            </span>
          </div>

          <div>
            <p className="text-xs font-mono uppercase text-neutral-400 mb-1">
              {projectCount} {projectCount === 1 ? "Project" : "Projects"}
            </p>

            <p className="text-sm font-medium">
              View Portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="pt-4">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold tracking-tight">
              {name}
            </h3>

            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-1">
              {role}
            </p>
          </div>

          <span className="text-xs text-neutral-400 group-hover:text-black transition-colors">
            ↗
          </span>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
            {skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[9px] font-mono uppercase tracking-wider text-neutral-500"
              >
                {skill}
                {index < Math.min(skills.length, 4) - 1 && " /"}
              </span>
            ))}
          </div>
        )}

      </div>
    </Link>
  );
}