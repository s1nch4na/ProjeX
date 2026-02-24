// src/pages/Landing.jsx
import React from "react";
import HorizontalScroller from "../components/HorizontalScroller";
import ProjectCard from "../components/ProjectCard";
import ProfileCard from "../components/ProfileCard";
import { Link } from "react-router-dom";
import { projects, profiles } from "../utils/mockData";


export default function Landing() {
  return (
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
      </section>

      {/* POPULAR CREATORS */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-3">
          Popular Creators
        </h2>

        <HorizontalScroller>
          {profiles.slice(0, 5).map((profile) => (
            <div key={profile.id} className="min-w-[250px]">
              <ProfileCard {...profile} />
            </div>
          ))}
        </HorizontalScroller>
      </section>

    </div>
  );
}