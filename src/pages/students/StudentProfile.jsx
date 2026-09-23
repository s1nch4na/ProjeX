import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Profile not found");
        }

        setCreator(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3EF] flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Loading profile...
        </p>
      </div>
    );
  }

  // Profile not found
  if (!creator) {
    return (
      <div className="min-h-screen bg-[#F3F3EF] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">
            404 / Creator Not Found
          </p>

          <h1 className="text-3xl font-bold">
            This creator doesn't exist.
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-black">

      {/* TOP NAV */}
      <nav className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-black">
        <button
          onClick={() => navigate(-1)}
          className="font-mono text-xs uppercase tracking-widest hover:underline"
        >
          ← Back
        </button>

        <h1 className="font-black tracking-tight text-xl">
          PROJEX
        </h1>

        <button
          className="font-mono text-xs uppercase tracking-widest hover:underline"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Profile link copied!");
          }}
        >
          Share
        </button>
      </nav>

      {/* PROFILE HEADER */}
      <section className="px-6 md:px-12 pt-10 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-end gap-6">

          {/* AVATAR */}
          <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 border-2 border-black bg-white overflow-hidden flex items-center justify-center">
            {creator.avatar_name ? (
              <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-4xl font-bold">
                {creator.name?.charAt(0)?.toUpperCase()}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-4xl font-bold">
                {creator.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          {/* NAME + ROLE */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                {creator.name}
              </h1>

              <span className="w-fit px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest">
                Creator
              </span>
            </div>

            <p className="mt-2 text-lg text-neutral-600">
              {creator.role}
            </p>

            {creator.location && (
              <p className="mt-1 text-sm text-neutral-500">
                📍 {creator.location}
              </p>
            )}
          </div>

          {/* FOLLOW */}
          <button
            className="px-6 py-3 border-2 border-black bg-white text-xs font-mono uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Follow
          </button>
        </div>

        {/* BIO */}
        <div className="max-w-3xl mt-8">
          <p className="text-lg leading-relaxed text-neutral-700">
            {creator.bio}
          </p>
        </div>

        {/* SOCIAL LINKS */}
        <div className="flex flex-wrap gap-4 mt-6">
          {creator.github && (
            <a
              href={creator.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono uppercase tracking-widest underline"
            >
              GitHub ↗
            </a>
          )}

          {creator.linkedin && (
            <a
              href={creator.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono uppercase tracking-widest underline"
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 md:px-12 mt-12">
        <div className="border-y border-black py-6 flex gap-12">
          <div>
            <p className="text-3xl font-black">0</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Projects
            </p>
          </div>

          <div>
            <p className="text-3xl font-black">0</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Followers
            </p>
          </div>

          <div>
            <p className="text-3xl font-black">0</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Following
            </p>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              Selected Work
            </p>

            <h2 className="text-3xl md:text-4xl font-black mt-2">
              Projects
            </h2>
          </div>
        </div>

        <div className="border-2 border-dashed border-neutral-400 p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            No projects yet
          </p>

          <p className="mt-2 text-neutral-600">
            This creator hasn't added any projects yet.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 md:px-12 py-16 border-t border-black">
        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              01 / About
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-lg leading-relaxed">
              {creator.bio || "No bio added yet."}
            </p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="px-6 md:px-12 py-16 border-t border-black">
        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              02 / Skills
            </p>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            {creator.skills && creator.skills.length > 0 ? (
              creator.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 border border-black bg-white text-xs font-mono uppercase tracking-wider"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-neutral-500">
                No skills added yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* COLLABORATION */}
      <section className="px-6 md:px-12 py-20 border-t border-black">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            03 / Collaboration
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-3">
            Want to work together?
          </h2>

          <p className="mt-5 text-neutral-600 text-lg">
            Interested in collaborating with {creator.name}?
          </p>

          <button className="mt-8 px-6 py-3 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition">
            Start a Conversation →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-12 py-8 border-t border-black">
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          PROJEX / CREATOR PROFILE
        </p>
      </footer>

    </div>
  );
}