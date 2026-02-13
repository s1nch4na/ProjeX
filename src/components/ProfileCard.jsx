// src/components/ProfileCard.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ProfileCard({ id, name, role, skills, image }) {
  const location = useLocation();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <Link
        to={`/creators/${id}`}
        state={{ background: location }}
        className="block"
      >
        <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          <img
            src={image || "https://placehold.co/400x400"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="font-semibold text-[#101624]">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {skills?.map((skill, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-[#7c3aed]/10 text-[#7c3aed] rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
