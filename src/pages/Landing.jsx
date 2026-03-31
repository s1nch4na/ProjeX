import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProfileCard from "../components/ProfileCard";
import { projects, profiles } from "../utils/mockData";

export default function Landing() {
  const projectRef = useRef(null);
  const profileRef = useRef(null);

  const scroll = (ref, dir) => {
    if (!ref.current) return;
    const amount = 400;
    ref.current.scrollLeft += dir === "left" ? -amount : amount;
  };

  return (
    <div className="min-h-screen text-[#0f172a]">

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">
        <div className="max-w-6xl mx-auto px-12 py-28">
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Build real projects.
            <br />
            <span className="text-purple-400">Not just resumes.</span>
          </h1>

          <p className="text-lg opacity-80 max-w-2xl mb-10">
            ProjeX connects students with startups and businesses
            looking for real work to be done.
          </p>

          <div className="flex gap-4">
            <Link
              to="/student"
              className="px-7 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition"
            >
              Explore Projects
            </Link>

            <Link
              to="/login"
              className="px-7 py-3 border border-white/30 rounded-lg hover:bg-white/10"
            >
              Post a Project
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-[#f8fafc] py-16">
        <div className="max-w-6xl mx-auto px-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>

            <div className="flex gap-3">
              <button
                onClick={() => scroll(projectRef, "left")}
                className="px-4 py-2 bg-white shadow rounded-lg"
              >
                ←
              </button>
              <button
                onClick={() => scroll(projectRef, "right")}
                className="px-4 py-2 bg-white shadow rounded-lg"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={projectRef}
            className="flex gap-6 overflow-x-auto no-scrollbar"
          >
            {projects.map((project) => (
              <div key={project.id} className="min-w-[320px]">
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TALENTS */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Popular Creators</h2>

            <div className="flex gap-3">
              <button
                onClick={() => scroll(profileRef, "left")}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                ←
              </button>
              <button
                onClick={() => scroll(profileRef, "right")}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={profileRef}
            className="flex gap-6 overflow-x-auto no-scrollbar"
          >
            {profiles.map((profile) => (
              <div key={profile.id} className="min-w-[240px]">
                <ProfileCard {...profile} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#0f172a] text-white py-20">
        <div className="max-w-6xl mx-auto px-12 grid grid-cols-3 text-center gap-10">
          <div>
            <h3 className="text-4xl font-bold text-purple-400">500+</h3>
            <p className="opacity-80">Students</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-purple-400">120+</h3>
            <p className="opacity-80">Projects Posted</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-purple-400">40+</h3>
            <p className="opacity-80">Startups</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Start building real projects today
        </h2>

        <p className="opacity-90 mb-8">
          Join ProjeX and collaborate with startups.
        </p>

        <Link
          to="/student"
          className="px-7 py-3 bg-white text-purple-600 rounded-lg font-semibold"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}