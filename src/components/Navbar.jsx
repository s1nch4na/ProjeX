// src/components/Navbar.jsx (or your global navigation file)
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Mock profile data for the global modal
  const [studentProfile, setStudentProfile] = useState({
    name: "Alex Rivera",
    email: "alex.rivera@jainuniversity.ac.in",
    role: "Full-Stack Builder & UI Enthusiast",
    bio: "Computer Science student specializing in React, full-stack architectures, and modern web animations.",
    avatar: "https://placehold.co/200x200",
    resumeName: "Alex_Rivera_Resume_2026.pdf"
  });

  const [appliedProjects] = useState([
    { id: 101, title: "EcoKart Mobile App", meta: "Full-Stack · Bengaluru", price: 15000 },
    { id: 102, title: "Fintech Dashboard UI", meta: "React/Tailwind · Remote", price: 22000 }
  ]);

  const [selectedProjects] = useState([
    { id: 101, title: "EcoKart Mobile App", meta: "Active Deployment", price: 15000 }
  ]);

  const [personalProjects, setPersonalProjects] = useState([
    { id: 201, title: "JuConnect Social Web App", meta: "React + Neon PostgreSQL", price: "Portfolio" }
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

  return (
    <>
      {/* GLOBAL NAVBAR */}
      <nav className="w-full bg-white border-b border-black px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-40">
        
        {/* Brand Logo */}
        <Link to="/" className="font-bold text-xl tracking-tight uppercase">
          PROJEX <span className="text-xs font-mono font-normal text-neutral-500">.REG</span>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="Search projects, creators..."
            className="w-full bg-[#F3F3EF] border border-black px-4 py-2 text-xs font-mono uppercase tracking-wider placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Right Side: Replaced the empty box with the Circular Profile Avatar */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:inline-block px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Login / Signup
          </Link>

          {/* CIRCULAR PROFILE TRIGGER (Replaces the empty box) */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-10 h-10 rounded-full border border-black overflow-hidden bg-white hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center shadow-sm"
            title="Open Profile & Resume"
          >
            <img src={studentProfile.avatar} alt={studentProfile.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </nav>

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
    </>
  );
}