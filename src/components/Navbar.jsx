// src/components/Navbar.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Read logged-in user
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("projex_user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Could not read ProJeX user:", error);
        setUser(null);
      }
    };

    loadUser();

    // Update navbar when login/signup changes localStorage
    window.addEventListener("storage", loadUser);
    window.addEventListener("projex-auth-change", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("projex-auth-change", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("projex_user");

    setUser(null);

    navigate("/login");
  };

  // Open logged-in user's actual profile
  const handleProfileClick = () => {
    if (!user?.id) {
      console.error("No user ID found in projex_user");
      return;
    }

    navigate(`/creators/${user.id}`);
  };

  return (
    <nav className="w-full bg-white border-b border-black px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-40">

      {/* LOGO */}
      <Link
        to="/"
        className="font-bold text-xl tracking-tight uppercase"
      >
        PROJEX{" "}
        <span className="text-xs font-mono font-normal text-neutral-500">
          .REG
        </span>
      </Link>

      {/* SEARCH */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <input
          type="text"
          placeholder="Search projects, creators..."
          className="w-full bg-[#F3F3EF] border border-black px-4 py-2 text-xs font-mono uppercase tracking-wider placeholder-neutral-500 focus:outline-none"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {!user ? (
          /* NOT LOGGED IN */
          <Link
            to="/login"
            className="px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Login / Signup
          </Link>
        ) : (
          /* LOGGED IN */
          <>
            {/* GREETING */}
            <span className="hidden sm:block text-xs font-mono uppercase tracking-wider">
              Hi, {user.name?.split(" ")[0] || "there"} 👋
            </span>

            {/* PROFILE CIRCLE */}
            <button
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full border border-black overflow-hidden bg-[#F3F3EF] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
              title="Open Profile"
            >
              <span className="text-sm font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="hidden sm:block text-[10px] font-mono uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-white transition"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}