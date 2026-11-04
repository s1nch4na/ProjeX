import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/api";

const linkClass =
  "text-sm text-neutral-600 transition-colors hover:text-black";
const mobileLinkClass =
  "block border-b border-neutral-200 py-3 text-sm text-neutral-700 hover:text-black";

export default function Navbar() {
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("projex_user");
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (error) {
        console.error("Could not read ProJeX user:", error);
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("projex-auth-change", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("projex-auth-change", loadUser);
    };
  }, []);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileOpen(false);
  const profilePath = user?.id ? `/creators/${user.id}` : "/login";
  const isOwner = user?.role === "investor";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="text-lg font-semibold tracking-[-0.04em] text-black"
        >
          PROJEX<span className="text-neutral-400">.REG</span>
        </Link>

        {user && (
          <div className="hidden items-center gap-7 md:flex">
            {isOwner ? (
              <>
                <Link to="/project-owner/talent" className={linkClass}>
                  Discover Talent
                </Link>
                <Link to="/project-owner/projects" className={linkClass}>
                  My Projects
                </Link>
                <Link to="/project-owner/chat" className={linkClass}>
                  Messages
                </Link>
              </>
            ) : (
              <>
                <Link to="/student" className={linkClass}>
                  Explore
                </Link>
                <Link to="/challenges" className={linkClass}>
                  Challenges
                </Link>
                <Link to="/student/chat" className={linkClass}>
                  Messages
                </Link>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {!user ? (
            <div className="hidden items-center gap-5 sm:flex">
              <Link to="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                to="/login"
                state={{ authMode: "signup" }}
                className="rounded-md bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-800"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="relative hidden md:block" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-black">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="max-w-28 truncate">
                  {user.name?.split(" ")[0] || "Account"}
                </span>
                <span className="text-xs text-neutral-400" aria-hidden="true">
                  ▾
                </span>
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg"
                >
                  <Link
                    to={profilePath}
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    to={isOwner ? "/project-owner" : "/student"}
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-100"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  {isOwner && (
                    <Link
                      to="/project-owner/post"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-100"
                      role="menuitem"
                    >
                      Post a Project
                    </Link>
                  )}
                  {user.is_admin && (
                    <Link
                      to="/admin/challenges"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-100"
                      role="menuitem"
                    >
                      Manage Challenges
                    </Link>
                  )}
                  <div className="my-1 border-t border-neutral-200" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100 hover:text-black"
                    role="menuitem"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-neutral-200 bg-white px-5 pb-4 sm:px-8 md:hidden">
          {user ? (
            <>
              {isOwner ? (
                <>
                  <Link to="/project-owner/talent" onClick={closeMobileMenu} className={mobileLinkClass}>
                    Discover Talent
                  </Link>
                  <Link to="/project-owner/projects" onClick={closeMobileMenu} className={mobileLinkClass}>
                    My Projects
                  </Link>
                  <Link to="/project-owner/chat" onClick={closeMobileMenu} className={mobileLinkClass}>
                    Messages
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/student" onClick={closeMobileMenu} className={mobileLinkClass}>
                    Explore
                  </Link>
                  <Link to="/challenges" onClick={closeMobileMenu} className={mobileLinkClass}>
                    Challenges
                  </Link>
                  <Link to="/student/chat" onClick={closeMobileMenu} className={mobileLinkClass}>
                    Messages
                  </Link>
                </>
              )}
              <Link to={profilePath} onClick={closeMobileMenu} className={mobileLinkClass}>
                Profile
              </Link>
              <Link to={isOwner ? "/project-owner" : "/student"} onClick={closeMobileMenu} className={mobileLinkClass}>
                Dashboard
              </Link>
              {isOwner && (
                <Link to="/project-owner/post" onClick={closeMobileMenu} className={mobileLinkClass}>
                  Post a Project
                </Link>
              )}
              {user.is_admin && (
                <Link to="/admin/challenges" onClick={closeMobileMenu} className={mobileLinkClass}>
                  Manage Challenges
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-left text-sm text-neutral-700 hover:border-black hover:text-black"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <Link to="/login" onClick={closeMobileMenu} className={mobileLinkClass}>
                Log in
              </Link>
              <Link
                to="/login"
                state={{ authMode: "signup" }}
                onClick={closeMobileMenu}
                className="mt-3 rounded-md bg-black px-3 py-2.5 text-center text-sm text-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
