// src/pages/students/StudentDashboard.jsx
import React, { useMemo, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import HorizontalScroller from "../../components/HorizontalScroller";
import { getAllProjects } from "../../utils/mockData";

// Import other active modules
import StudentChallenges from "./StudentChallenges";
import StudentChat from "./StudentChat";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("projects"); // projects | challenges | chat
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Controls the Behance-style profile popup

  // Mock student profile data
  const [studentProfile, setStudentProfile] = useState({
    name: "Alex Rivera",
    email: "alex.rivera@jainuniversity.ac.in",
    role: "Full-Stack Builder & UI Enthusiast",
    bio: "Computer Science student specializing in React, full-stack architectures, and modern web animations.",
    avatar: "https://placehold.co/200x200",
    resumeName: "Alex_Rivera_Resume_2026.pdf"
  });

  // Mock lists for the profile view
  const [appliedProjects] = useState([
    { id: 101, title: "EcoKart Mobile App", meta: "Full-Stack · Bengaluru", price: 15000 },
    { id: 102, title: "Fintech Dashboard UI", meta: "React/Tailwind · Remote", price: 22000 }
  ]);

  const [selectedProjects] = useState([
    { id: 101, title: "EcoKart Mobile App", meta: "Active Deployment", price: 15000 }
  ]);

  const [personalProjects, setPersonalProjects] = useState([
    { id: 201, title: "JuConnect Social Web App", meta: "React + Neon PostgreSQL", price: "Open Source" }
  ]);

  const [newPersonalTitle, setNewPersonalTitle] = useState("");

  const handleAddPersonalProject = (e) => {
    e.preventDefault();
    if (!newPersonalTitle.trim()) return;
    setPersonalProjects([
      ...personalProjects,
      { id: Date.now(), title: newPersonalTitle, meta: "Personal Broadcast", price: "Portfolio" }
    ]);
    setNewPersonalTitle("");
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentProfile({ ...studentProfile, resumeName: file.name });
      alert(`Resume "${file.name}" uploaded successfully!`);
    }
  };

  const all = getAllProjects();
  const [projects] = useState(all);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const visible = useMemo(() => {
    let list = [...projects];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.meta || "").toLowerCase().includes(q)
      );
    }
    if (sort === "newest") {
      list.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (sort === "price") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [projects, query, sort]);

  return (
    <div className={`min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-12 selection:bg-black selection:text-white relative ${
      isProfileModalOpen ? "overflow-hidden" : ""
    }`}>
      
      {/* BACKGROUND CONTENT (Blurs when profile modal is open) */}
      <div className={`transition-all duration-300 ${isProfileModalOpen ? "filter blur-sm pointer-events-none select-none" : ""}`}>
        
        {/* Top Header Banner with Profile Avatar Icon on the Right */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-4 border-b border-black gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Student Control Center</span>
            <h2 className="text-3xl font-bold tracking-tight uppercase mt-1">Workspace</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation Tabs */}
            <div className="flex gap-1 bg-white border border-black p-1">
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === "projects" ? "bg-black text-white" : "hover:bg-neutral-100 text-black"
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setActiveTab("challenges")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === "challenges" ? "bg-black text-white" : "hover:bg-neutral-100 text-black"
                }`}
              >
                Challenges
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === "chat" ? "bg-black text-white" : "hover:bg-neutral-100 text-black"
                }`}
              >
                Messages
              </button>
            </div>

            {/* Top-Right Circular Avatar Icon Trigger */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-10 h-10 rounded-full border border-black overflow-hidden bg-white hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center shadow-sm"
              title="Open Profile & Resume"
            >
              <img src={studentProfile.avatar} alt={studentProfile.name} className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "projects" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2.5 bg-white border border-black text-xs font-mono uppercase tracking-wider rounded-none focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price">Sort: Highest Price</option>
              </select>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-4 py-2.5 bg-white border border-black text-xs font-mono uppercase tracking-wider flex-1 placeholder-neutral-500 rounded-none focus:outline-none"
                placeholder="Search by keyword or city..."
              />
            </div>

            <div className="mb-14">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold uppercase tracking-tight">Featured Openings</h3>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">[ Top Tier ]</span>
              </div>
              <div className="border border-black bg-white p-6">
                <HorizontalScroller>
                  {projects.slice(0, 18).map((p) => (
                    <div key={p.id} className="min-w-[320px]">
                      <ProjectCard {...p} />
                    </div>
                  ))}
                </HorizontalScroller>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold uppercase tracking-tight">All Listings</h3>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                  Showing {visible.length} results
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((p) => (
                  <ProjectCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="bg-white border border-black p-6">
            <StudentChallenges />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="bg-white border border-black p-6">
            <StudentChat />
          </div>
        )}
      </div>

      {/* BEHANCE-STYLE PROFILE & RESUME MODAL OVERLAY */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-white border border-black p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 bg-[#F3F3EF] border border-black text-black font-mono flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Profile Header (Behance Style: Circular Image + Info side-by-side) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-black">
              <div className="w-28 h-28 rounded-full border-2 border-black overflow-hidden bg-[#F3F3EF] shrink-0">
                <img src={studentProfile.avatar} alt={studentProfile.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">{studentProfile.role}</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight mt-1">{studentProfile.name}</h2>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">{studentProfile.email}</p>
                <p className="text-xs text-neutral-700 mt-3 leading-relaxed max-w-xl">{studentProfile.bio}</p>
              </div>
            </div>

            {/* Resume Management Section */}
            <div className="py-6 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">Curriculum Vitae</span>
                <span className="text-sm font-bold text-black font-mono mt-1 block">📄 {studentProfile.resumeName}</span>
              </div>
              <label className="px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer">
                Upload New Resume
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>

            {/* Projects Sections: Applied, Selected, Broadcast */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-neutral-200">
              
              {/* Applied */}
              <div className="bg-[#F3F3EF] border border-black p-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">Applied ({appliedProjects.length})</h4>
                <div className="space-y-2">
                  {appliedProjects.map((p) => (
                    <div key={p.id} className="bg-white border border-black p-3 text-xs">
                      <p className="font-bold uppercase">{p.title}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{p.meta}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected */}
              <div className="bg-[#F3F3EF] border border-black p-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">Selected ({selectedProjects.length})</h4>
                <div className="space-y-2">
                  {selectedProjects.map((p) => (
                    <div key={p.id} className="bg-white border border-black p-3 text-xs">
                      <p className="font-bold uppercase">{p.title}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Active Deployment</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Broadcast */}
              <div className="bg-[#F3F3EF] border border-black p-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">Broadcasts ({personalProjects.length})</h4>
                <div className="space-y-2 mb-3">
                  {personalProjects.map((p) => (
                    <div key={p.id} className="bg-white border border-black p-3 text-xs">
                      <p className="font-bold uppercase">{p.title}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{p.meta}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddPersonalProject} className="flex gap-1">
                  <input
                    type="text"
                    value={newPersonalTitle}
                    onChange={(e) => setNewPersonalTitle(e.target.value)}
                    placeholder="Add project..."
                    className="w-full bg-white border border-black px-2 py-1 text-xs focus:outline-none"
                  />
                  <button type="submit" className="bg-black text-white px-2 py-1 text-xs font-mono uppercase cursor-pointer">
                    +
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer Close */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-6 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}