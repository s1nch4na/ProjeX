import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProfileCard from "../components/ProfileCard";
<<<<<<< HEAD
import { projects, profiles } from "../utils/mockData";
=======
import { Link } from "react-router-dom";
import { projects, profiles } from "../utils/mockData";

>>>>>>> a91243805d08f328402fd2e4be2d22368deee673

export default function Landing() {
  const projectRef = useRef(null);
  const profileRef = useRef(null);

  const scroll = (ref, dir) => {
    if (!ref.current) return;
    const amount = 400;
    ref.current.scrollLeft += dir === "left" ? -amount : amount;
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen text-[#0f172a]">

      {/* HERO (DARK GRADIENT LIKE STARTUP SITES) */}
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
=======
    <div className="px-12 py-10 bg-[var(--page-bg)] text-[#101624] min-h-[80vh]">
      
      {/* HERO */}
      <header className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-3">
          Connect students with local businesses — fast.
        </h1>

        <p className="text-gray-600 mb-6">
          Post a project, receive student submissions, collaborate and finish —
          low cost, real experience.
        </p>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-[#7c3aed] text-white rounded-lg"
          >
            Get started
          </Link>

          <Link
            to="/student"
            className="px-6 py-3 border rounded-lg"
          >
            Explore work
          </Link>
        </div>
      </header>

      {/* FEATURED PROJECTS */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-3">
          Featured Projects
        </h2>

        <HorizontalScroller>
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="min-w-[320px]">
              <ProjectCard {...project} />
            </div>
          ))}
        </HorizontalScroller>
>>>>>>> a91243805d08f328402fd2e4be2d22368deee673
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

      {/* TALENTS SECTION (DIFFERENT BACKGROUND) */}
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

      {/* STATS SECTION (THIS MAKES IT LOOK LEGIT) */}
      <section className="bg-[#0f172a] text-white py-20">
        <div className="max-w-6xl mx-auto px-12 grid grid-cols-3 text-center gap-10">

          <div>
            <h3 className="text-4xl font-bold text-purple-400">
              500+
            </h3>
            <p className="opacity-80">Students</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-purple-400">
              120+
            </h3>
            <p className="opacity-80">Projects Posted</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-purple-400">
              40+
            </h3>
            <p className="opacity-80">Startups</p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Start building real projects today
        </h2>

<<<<<<< HEAD
        <p className="opacity-90 mb-8">
          Join ProjeX and collaborate with startups.
        </p>

        <Link
          to="/student"
          className="px-7 py-3 bg-white text-purple-600 rounded-lg font-semibold"
        >
          Get Started
        </Link>
=======
        <HorizontalScroller>
          {profiles.slice(0, 5).map((profile) => (
            <div key={profile.id} className="min-w-[250px]">
              <ProfileCard {...profile} />
            </div>
          ))}
        </HorizontalScroller>
>>>>>>> a91243805d08f328402fd2e4be2d22368deee673
      </section>

    </div>
  );
}