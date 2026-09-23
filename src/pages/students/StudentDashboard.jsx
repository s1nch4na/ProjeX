// src/pages/students/StudentDashboard.jsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../../components/ProjectCard";
import HorizontalScroller from "../../components/HorizontalScroller";
import { getAllProjects } from "../../utils/mockData";

import StudentChallenges from "./StudentChallenges";
import StudentChat from "./StudentChat";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("projects");

  // Temporary student profile data
  // Later this can come from your backend/database.
  const studentProfile = {
    id: 1,
    name: "Alex Rivera",
    email: "alex.rivera@jainuniversity.ac.in",
    role: "Full-Stack Builder & UI Enthusiast",
    bio: "Computer Science student specializing in React, full-stack architectures, and modern web animations.",
    avatar: "https://placehold.co/200x200",
  };

  // Marketplace projects
  const all = getAllProjects();
  const [projects] = useState(all);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  // Search + sorting
  const visible = useMemo(() => {
    let list = [...projects];

    if (query.trim()) {
      const q = query.toLowerCase();

      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          (p.meta || "").toLowerCase().includes(q)
      );
    }

    if (sort === "newest") {
      list.sort(
        (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
      );
    } else if (sort === "price") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return list;
  }, [projects, query, sort]);

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-12 selection:bg-black selection:text-white">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-4 border-b border-black gap-4">

        {/* Page title */}
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
            Student Control Center
          </span>

          <h2 className="text-3xl font-bold tracking-tight uppercase mt-1">
            Workspace
          </h2>
        </div>

        {/* Navigation + Profile */}
        <div className="flex items-center gap-4">

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-white border border-black p-1">

            <button
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "projects"
                  ? "bg-black text-white"
                  : "hover:bg-neutral-100 text-black"
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => setActiveTab("challenges")}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "challenges"
                  ? "bg-black text-white"
                  : "hover:bg-neutral-100 text-black"
              }`}
            >
              Challenges
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "chat"
                  ? "bg-black text-white"
                  : "hover:bg-neutral-100 text-black"
              }`}
            >
              Messages
            </button>

          </div>

          {/* =================================================
              PROFILE AVATAR
              Opens the separate StudentProfile page
          ================================================= */}

          <button
            onClick={() => navigate(`/creators/${studentProfile.id}`)}
            className="w-10 h-10 rounded-full border border-black overflow-hidden bg-white hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center shadow-sm"
            title="View Profile"
          >
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-full h-full object-cover"
            />
          </button>

        </div>
      </div>


      {/* =====================================================
          TAB CONTENT
      ===================================================== */}

      {/* =====================================================
          MARKETPLACE
      ===================================================== */}

      {activeTab === "projects" && (
        <div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 bg-white border border-black text-xs font-mono uppercase tracking-wider rounded-none focus:outline-none cursor-pointer"
            >
              <option value="newest">
                Sort: Newest
              </option>

              <option value="price">
                Sort: Highest Price
              </option>
            </select>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2.5 bg-white border border-black text-xs font-mono uppercase tracking-wider flex-1 placeholder-neutral-500 rounded-none focus:outline-none"
              placeholder="Search by keyword or city..."
            />

          </div>


          {/* =================================================
              FEATURED OPENINGS
          ================================================= */}

          <div className="mb-14">

            <div className="flex justify-between items-end mb-6">

              <h3 className="text-xl font-bold uppercase tracking-tight">
                Featured Openings
              </h3>

              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                [ Top Tier ]
              </span>

            </div>

            <div className="border border-black bg-white p-6">

              <HorizontalScroller>

                {projects.slice(0, 18).map((p) => (
                  <div
                    key={p.id}
                    className="min-w-[320px]"
                  >
                    <ProjectCard {...p} />
                  </div>
                ))}

              </HorizontalScroller>

            </div>

          </div>


          {/* =================================================
              ALL LISTINGS
          ================================================= */}

          <div>

            <div className="flex justify-between items-end mb-6">

              <h3 className="text-xl font-bold uppercase tracking-tight">
                All Listings
              </h3>

              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Showing {visible.length} results
              </span>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {visible.length > 0 ? (
                visible.map((p) => (
                  <ProjectCard
                    key={p.id}
                    {...p}
                  />
                ))
              ) : (
                <div className="col-span-full border border-black bg-white p-10 text-center">

                  <p className="font-mono text-sm uppercase tracking-wider text-neutral-500">
                    No projects found
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          CHALLENGES
      ===================================================== */}

      {activeTab === "challenges" && (
        <div className="bg-white border border-black p-6">
          <StudentChallenges />
        </div>
      )}


      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {activeTab === "chat" && (
        <div className="bg-white border border-black p-6">
          <StudentChat />
        </div>
      )}

    </div>
  );
}