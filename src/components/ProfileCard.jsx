// src/components/ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom"; // Removed useLocation since it's no longer needed here

export default function ProfileCard({ id, name, role, skills, image }) {
  return (
    <div className="bg-white p-4 border border-black rounded-none shadow-none">
      <Link
        to={`/creators/${id}`}
        className="block"
      >
        <div className="w-full h-40 bg-[#F3F3EF] border border-black rounded-none mb-3 overflow-hidden">
          <img
            src={image || "https://placehold.co/400x400"}
            alt={name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 rounded-none"
          />
        </div>

        <h3 className="font-bold text-[#0A0A0A] uppercase tracking-tight">{name}</h3>
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-0.5">{role}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills?.map((skill, index) => (
            <span
              key={index}
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#F3F3EF] border border-black text-black rounded-none"
            >
              {skill}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}