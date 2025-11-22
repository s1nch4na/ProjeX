import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const loc = useLocation();
  return (
    <nav className="w-full bg-[#0f1629] border-b border-[#111827]/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">ProjeX</h1>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <input
            type="text"
            placeholder="Search projects, creators..."
            className="w-full px-4 py-2 rounded-lg bg-[#1b2337] text-gray-300 placeholder-gray-400 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <button className="px-5 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium transition">
              Login / Signup
            </button>
          </Link>

          {/* Example: small dropdown could go here. For now profile bubble links to student profile */}
          <Link to="/student/profile" className="block">
            <div className="w-10 h-10 bg-[#1f2937] rounded-full shadow-md hover:scale-105 transition cursor-pointer" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
